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

    calculateLoanDetailsFromPayments = (payments: LoanDetails): LoanDetail => {
        const summary = reduce(payments, (acc, { interest, principal, payment }) => ({
            interest: acc.interest + interest,
            principal: acc.principal + principal,
            payment: acc.payment + payment
        }), { interest: 0, principal: 0, payment: 0 });

        const lastPayment = payments[payments.length - 1];
        const firstPayment = payments[0];
        const rate = payments.reduce((sum, { rate }) => sum + rate, 0) / payments.length;
        return {
            ...summary,
            balance: lastPayment?.balance as number,
            ends: lastPayment?.ends as number,
            begins: firstPayment?.begins as number,
            rate,
            loan: firstPayment?.loan as number
        } as LoanDetail;
    };

    calculateMonthlyPayments = (loanPrimaryData: LoanPrimaryData, monthlyPayment: number, loanDetails: LoanDetails = []): LoanDetails => {
        let { loan, rate, begins } = loanPrimaryData;
        if (loan <= 0) return loanDetails;

        const interest = rate * loan / 1200;
        const principal = monthlyPayment - interest;
        const balance = Math.round((loan - principal) * 100) / 100;
        const ends = new Date(begins);
        ends.setMonth(ends.getMonth() + 1);
        const nextMonth = ends.getTime();

        loanDetails.push({
            begins: nextMonth,
            payment: monthlyPayment,
            interest,
            rate,
            ends: nextMonth,
            loan,
            balance,
            principal
        });

        return this.calculateMonthlyPayments({ ...loanPrimaryData, begins: nextMonth, loan: balance }, monthlyPayment, loanDetails);
    }

    getRemainingBalanceByDate = (date: number): number => {
        if (!this.state.loan.loan) return 0;
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
        try {
            const { loan, begins, rate } = loanPrimaryData;
            const monthlyPayment = this.getMonthlyPayment(loan, rate);
            const monthlyPayments: LoanDetails = this.calculateMonthlyPayments(loanPrimaryData, monthlyPayment, []);
            const newLoanDetails = this.calculateLoanDetailsFromPayments(monthlyPayments);
            const newLoanTerm: LoanTerm = {
                monthlyPayments,
                ...newLoanDetails
            }

            const lastLoanTerm: LoanTerm | undefined = this.state.loan.loans.pop();

            if (lastLoanTerm) {
                this.updateLastLoanTerm(lastLoanTerm, newLoanTerm);
            }

            this.state.loan.loans.push(newLoanTerm);
            this.updateLoanSummary();
        } catch (e) {
            console.error("Error adding refinance:", e);
        }
    }

    private updateLastLoanTerm(lastLoanTerm: LoanTerm, newLoanTerm: LoanTerm): void {
        const firstMonthOfNewLoanTerm = head(newLoanTerm.monthlyPayments)?.begins;

        if (!firstMonthOfNewLoanTerm) return;

        const updatedMonthlyPayments = remove(lastLoanTerm.monthlyPayments, ({ begins }) => begins <= firstMonthOfNewLoanTerm);
        updatedMonthlyPayments.pop();

        if (updatedMonthlyPayments.length === 0) return;

        const updatedLoanDetails = this.calculateLoanDetailsFromPayments(updatedMonthlyPayments);
        this.state.loan.loans.push({ ...updatedLoanDetails, monthlyPayments: updatedMonthlyPayments });
    }

    private updateLoanSummary(): void {
        const allMonthlyPayments = this.state.loan.loans.map((loan) => loan.monthlyPayments);
        const combinedMonthlyPayments = concat(...allMonthlyPayments);
        const loanDetails = this.calculateLoanDetailsFromPayments(combinedMonthlyPayments);

        this.stashMemory.push(loanDetails);
        this.state.loan = { loans: this.state.loan.loans, ...loanDetails };
    }

    getSummary = () => {
        return this.state.loan;
    };
}