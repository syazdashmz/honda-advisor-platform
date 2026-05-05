const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

function calculateHirePurchase({
  car_price,
  down_payment,
  interest_rate,
  loan_years,
  trade_in_value = 0,
}) {
  const carPrice = Number(car_price);
  const downPayment = Number(down_payment);
  const interestRate = Number(interest_rate);
  const loanYears = Number(loan_years);
  const tradeInValue = Number(trade_in_value || 0);

  const loanAmount = Math.max(carPrice - downPayment - tradeInValue, 0);
  const totalInterest = loanAmount * (interestRate / 100) * loanYears;
  const estimatedMonthlyPayment = (loanAmount + totalInterest) / (loanYears * 12);

  return {
    car_price: Number(carPrice.toFixed(2)),
    down_payment: Number(downPayment.toFixed(2)),
    interest_rate: Number(interestRate.toFixed(2)),
    loan_years: loanYears,
    trade_in_value: Number(tradeInValue.toFixed(2)),
    loan_amount: Number(loanAmount.toFixed(2)),
    total_interest: Number(totalInterest.toFixed(2)),
    estimated_monthly_payment: Number(estimatedMonthlyPayment.toFixed(2)),
  };
}

function buildAdvisorNote(monthlyPayment) {
  if (monthlyPayment <= 900) {
    return 'Estimated monthly payment looks suitable for budget-focused buyers. Final approval depends on bank assessment.';
  }

  if (monthlyPayment <= 1300) {
    return 'Estimated monthly payment is in the mid-range. Consider comparing down payment options and loan tenure.';
  }

  if (monthlyPayment <= 1800) {
    return 'Estimated monthly payment is higher. Increasing down payment may help reduce monthly commitment.';
  }

  return 'Estimated monthly payment is premium-level. Confirm affordability, loan eligibility, and final package with the advisor.';
}

async function calculateLoan(req, res) {
  try {
    const {
      car_price,
      down_payment,
      interest_rate,
      loan_years,
      trade_in_value,
    } = req.body;

    if (!car_price || !down_payment || !interest_rate || !loan_years) {
      return errorResponse(
        res,
        'Car price, down payment, interest rate, and loan years are required',
        400
      );
    }

    if (Number(car_price) <= 0 || Number(loan_years) <= 0) {
      return errorResponse(res, 'Car price and loan years must be greater than zero', 400);
    }

    const calculation = calculateHirePurchase({
      car_price,
      down_payment,
      interest_rate,
      loan_years,
      trade_in_value,
    });

    const advisorNote = buildAdvisorNote(calculation.estimated_monthly_payment);

    return successResponse(res, 'Loan calculated successfully', {
      ...calculation,
      advisor_note: advisorNote,
      disclaimer:
        'Estimated monthly installment only. Final price, interest rate, loan approval, insurance, road tax, promotion, and stock must be confirmed with the advisor/dealership.',
    });
  } catch (error) {
    console.error('calculateLoan error:', error);
    return errorResponse(res, 'Failed to calculate loan');
  }
}

async function saveLoanCalculation(req, res) {
  try {
    const {
      user_id,
      car_model_id,
      car_variant_id,
      car_price,
      down_payment,
      interest_rate,
      loan_years,
      trade_in_value,
    } = req.body;

    if (!car_price || !down_payment || !interest_rate || !loan_years) {
      return errorResponse(
        res,
        'Car price, down payment, interest rate, and loan years are required',
        400
      );
    }

    const calculation = calculateHirePurchase({
      car_price,
      down_payment,
      interest_rate,
      loan_years,
      trade_in_value,
    });

    const advisorNote = buildAdvisorNote(calculation.estimated_monthly_payment);

    const [result] = await database.query(
      `
      INSERT INTO loan_calculations (
        user_id,
        car_model_id,
        car_variant_id,
        car_price,
        down_payment,
        interest_rate,
        loan_years,
        trade_in_value,
        loan_amount,
        total_interest,
        estimated_monthly_payment,
        advisor_note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id || null,
        car_model_id || null,
        car_variant_id || null,
        calculation.car_price,
        calculation.down_payment,
        calculation.interest_rate,
        calculation.loan_years,
        calculation.trade_in_value,
        calculation.loan_amount,
        calculation.total_interest,
        calculation.estimated_monthly_payment,
        advisorNote,
      ]
    );

    const [savedCalculation] = await database.query(
      `
      SELECT
        lc.*,
        cm.name AS car_model_name,
        cv.variant_name AS car_variant_name
      FROM loan_calculations lc
      LEFT JOIN car_models cm ON lc.car_model_id = cm.id
      LEFT JOIN car_variants cv ON lc.car_variant_id = cv.id
      WHERE lc.id = ?
      `,
      [result.insertId]
    );

    return successResponse(
      res,
      'Loan calculation saved successfully',
      savedCalculation[0],
      201
    );
  } catch (error) {
    console.error('saveLoanCalculation error:', error);
    return errorResponse(res, 'Failed to save loan calculation');
  }
}

async function getAllLoanCalculations(req, res) {
  try {
    const [calculations] = await database.query(`
      SELECT
        lc.*,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug,
        cv.variant_name AS car_variant_name
      FROM loan_calculations lc
      LEFT JOIN car_models cm ON lc.car_model_id = cm.id
      LEFT JOIN car_variants cv ON lc.car_variant_id = cv.id
      ORDER BY lc.created_at DESC
    `);

    return successResponse(
      res,
      'Loan calculations fetched successfully',
      calculations
    );
  } catch (error) {
    console.error('getAllLoanCalculations error:', error);
    return errorResponse(res, 'Failed to fetch loan calculations');
  }
}

module.exports = {
  calculateLoan,
  saveLoanCalculation,
  getAllLoanCalculations,
};