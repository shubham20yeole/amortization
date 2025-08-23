import moment from "moment";
import { AmortizationCalculatorInterface, LoanDetail, LoanDetails, LoanPrimaryData, LoanTerm, State } from "../types";
import { concat, head, reduce, remove } from "lodash";
export class AmortizationCalculator implements AmortizationCalculatorInterface {
    state: State = {
        graph: [],
        loan: {
            loans: [],
            begins: 0,
            ends: 0,
            loan: 0,
            balance: 0,
            interest: 0,
            principal: 0,
            payment: 0,
            rate: 0
        }
    };
    stashMemory: LoanDetail[] = []
    readonly period: number = 30 * 12;
    init(): void {
    }

    getLoanTermsInformation = () => {
        return this.state.loan.loans;
    }
    getMonthlyPayment = (loan: number, rate: number): number => {
        const interMetent = Math.pow((1 + rate / 1200), this.period);
        return (loan * rate / 1200 * interMetent) / (interMetent - 1)
    }

    calculateLoanDetailsFromPayments(payments: LoanDetails): LoanDetail {
        let totalInterest = 0;
        let totalPrincipal = 0;
        let totalPayment = 0;
        let lastBalance = 0;
        let lastMonth = 0;
        let firstMonth = 0;
        let loan = 0;

        const sumOfAllRates = reduce(payments, function (sum, { rate }) {
            return sum + rate;
        }, 0);
        let rate = sumOfAllRates / payments.length;
        payments.forEach(payment => {
            totalInterest += payment.interest;
            totalPrincipal += payment.principal;
            totalPayment += payment.payment;
        });

        lastBalance = payments.at(-1)?.balance as number;
        lastMonth = payments.at(-1)?.ends as number;
        firstMonth = payments.at(0)?.begins as number;
        loan = payments.at(0)?.loan as number;
        return {
            interest: totalInterest,
            principal: totalPrincipal,
            payment: totalPayment,
            balance: lastBalance,
            ends: lastMonth,
            begins: firstMonth,
            rate,
            loan
        } as LoanDetail;
    }

    calculateMonthlyPayments = (loanPrimaryData: LoanPrimaryData, monthlyPayment: number, loanDetails: LoanDetails): LoanDetails => {
        const { loan, rate, begins } = loanPrimaryData;
        const interest = rate * loan / 1200;
        const principal = monthlyPayment - interest;
        const balance = Math.round((loan - principal) * 100) / 100;
        if (balance <= 0) return loanDetails;

        const nextMonth = new Date(begins);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const newInstallment: LoanDetail = {
            begins: nextMonth.getTime(),
            payment: monthlyPayment,
            interest,
            rate,
            ends: nextMonth.getTime(),
            loan,
            balance,
            principal
        }
        loanDetails.push(newInstallment);
        loanPrimaryData.begins = newInstallment.ends;
        return this.calculateMonthlyPayments({ ...loanPrimaryData, loan: balance }, monthlyPayment, loanDetails)
    }

    getRemainingBalanceByDate = (date: number): number => {
        if(!this.state.loan.loan) return 0;
        let balance = 0;
        this.state.loan.loans.forEach((loanTerm: LoanTerm) => {
            loanTerm.monthlyPayments.forEach(monthlyPayment => {
                if (moment(new Date(monthlyPayment.begins)).format("YYYY/MM") === moment(new Date(date)).format("YYYY/MM")) {
                    balance = monthlyPayment.balance;
                }
            });
        });
        return balance;
    }

    addRefinance(loanPrimaryData: LoanPrimaryData): void {
        const { loan, begins, rate } = loanPrimaryData;
        const monthlyPayment = this.getMonthlyPayment(loan, rate);
        const monthlyPayments: LoanDetails = this.calculateMonthlyPayments(loanPrimaryData, monthlyPayment, []);
        const newloanTerm: LoanTerm = {
            loan,
            begins,
            rate,
            monthlyPayments,
            ends: 0, // get last date from monthlyPayments
            balance: 0, // get last balance from monthlyPayments
            interest: 0, // get sum of all interest from monthlyPayments
            principal: 0, // get sum of all principal from monthlyPayments
            payment: 0 // get sum of all payment from monthlyPayments
        }
        // now we push anyway to this.state.loan
        //  if we want to push
        const lastLoanTerm: LoanTerm | undefined = this?.state?.loan?.loans.pop();
        const newLoanDetails = this.calculateLoanDetailsFromPayments(newloanTerm.monthlyPayments);
        if (lastLoanTerm) {
            const firstMonthOfNewLoanTerm = head(newloanTerm.monthlyPayments)?.begins;
            // delete all monthlyPayments of lastLoanTerm after firstMonthOfNewLoanTerm
            const updatedMontlyPaymentsForLastLoanTerm: LoanDetails | undefined | 0 = firstMonthOfNewLoanTerm && remove(lastLoanTerm.monthlyPayments, function ({ begins }, index) {
                return begins <= firstMonthOfNewLoanTerm;
            });
            updatedMontlyPaymentsForLastLoanTerm && updatedMontlyPaymentsForLastLoanTerm.pop();
            // update lastLoanTerm in state
            const updatedLastLoanDetails: 0 | LoanDetail | undefined = updatedMontlyPaymentsForLastLoanTerm && this.calculateLoanDetailsFromPayments(updatedMontlyPaymentsForLastLoanTerm)
            updatedMontlyPaymentsForLastLoanTerm && updatedLastLoanDetails && this.state.loan.loans.push({ ...updatedLastLoanDetails, monthlyPayments: updatedMontlyPaymentsForLastLoanTerm });
        }
        const newloanTermUpdated: LoanTerm = { monthlyPayments: newloanTerm.monthlyPayments, ...newLoanDetails }
        this.state.loan.loans.push(newloanTermUpdated);
        const allMonthlyPayments = this.state.loan.loans.map((loan) => loan.monthlyPayments)
        this.stashMemory.push(this.calculateLoanDetailsFromPayments(concat(...allMonthlyPayments)))

        this.state.loan = { loans: this.state.loan.loans, ...this.calculateLoanDetailsFromPayments(concat(...allMonthlyPayments)) }
    }

    getSummary = () => {
        return this.state.loan;
    };
}