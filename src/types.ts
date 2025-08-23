
export interface LoanDetail {
	begins: number, // loan begin date
	ends: number, // loan end date
	loan: number, // loan amount
	balance: number, // loan balance
	interest: number, // total interest paid
	principal: number, // total principal paid
	payment: number, // total payment paid
    rate: number,
}

export type LoanPrimaryData = {
    loan: number;
    begins: number;
    rate: number;
}
export type LoanDetails = LoanDetail[];

export interface LoanTerm extends LoanDetail {
	monthlyPayments: LoanDetails;
}

export interface Loan extends LoanDetail {
	loans: LoanTerm[];
}

export type GraphInterface = LoanDetails

export interface State {
    graph: GraphInterface;
    loan: Loan;
}

export interface AmortizationCalculatorInterface {
    state: State;
    period: number;
    init: () => void;
    
    getMonthlyPayment: (loan: number, rate: number) => number;

    // calculate this LoanTerm.monthlyPayments, LoanTerm
    // then put in State.loan.loans.push();
    // then deduct this loan term months from previous loan term months
    // recalculate state numbers
    // 
    addRefinance: (loanPrimaryData: LoanPrimaryData) => void;
    calculateMonthlyPayments: (loanPrimaryData: LoanPrimaryData, monthlyPayment: number, loanDetails: LoanDetails) => LoanDetails;
    calculateLoanDetailsFromPayments: (payments: LoanDetails) => LoanDetail;
    getSummary: () => LoanDetail;

}
//  const loan: Loan = [] as unknown as Loan
// loan.loans[0].monthlyPayments[0].


/* Sample State
{
	Loan: {
		loans: [{
			begins,
			ends,
			loan,
			rate,
			balance,
			interest,
			principal,
			payment,
			monthlyPayments: [{
				begins,
				ends,
				rate,
				loan,
				balance,
				interest,
				principal,
				payment,
			}]
		}],
		begins,
		ends,
		rate,
		loan,
		balance,
		interest,
		principal,
		payment,
	}
	Graph: [{
		begins,
		ends,
		rate,
		loan,
		balance,
		interest,
		principal,
		payment,
	}]
}
 */