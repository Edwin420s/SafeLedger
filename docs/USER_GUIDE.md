# SafeLedger User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Registration](#user-registration)
3. [Login & Authentication](#login--authentication)
4. [Creating Loan Agreements](#creating-loan-agreements)
5. [Managing Agreements](#managing-agreements)
6. [Recording Payments](#recording-payments)
7. [Blockchain Verification](#blockchain-verification)
8. [Trust Score System](#trust-score-system)
9. [Security Features](#security-features)
10. [Troubleshooting](#troubleshooting)

## Getting Started

SafeLedger is a blockchain-powered lending platform that brings trust and transparency to informal financial agreements. This guide will help you navigate the platform effectively.

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Valid phone number for registration
- Kenya-focused (supports KES currency and Kenyan phone formats)

## User Registration

### Step 1: Access the Platform
1. Open your web browser
2. Navigate to the SafeLedger application URL
3. Click on "Register" in the navigation menu

### Step 2: Complete Registration Form
1. **Phone Number**: Enter your Kenyan phone number (e.g., 0712345678, +254712345678)
2. **Password**: Create a strong password (minimum 6 characters)
3. **Full Name**: Enter your legal name as it appears on official documents
4. Click "Create Account"

### Step 3: Account Verification
- Your phone number must be unique in the system
- Account is created immediately upon successful registration
- You'll receive a confirmation message on successful registration

## Login & Authentication

### Logging In
1. Click "Login" in the navigation menu
2. Enter your registered phone number
3. Enter your password
4. Click "Sign In"

### Session Management
- Your session remains active for 7 days
- You'll be automatically logged out after 7 days for security
- Always log out when using shared devices

## Creating Loan Agreements

### Step 1: Navigate to Dashboard
1. Log in to your account
2. You'll be redirected to the Dashboard
3. Click "Create New Agreement" or use the agreement form

### Step 2: Enter Agreement Details

#### Borrower Information
- **Borrower Phone Number**: Enter the registered phone number of the borrower
- *Note: The borrower must already be a registered SafeLedger user*

#### Financial Details
- **Loan Amount (KES)**: Enter the loan amount in Kenyan Shillings
- **Interest Rate (%)**: Annual interest rate (default: 5.0%)
- **Penalty Rate (%)**: Monthly penalty rate for late payments (default: 2.0%)

#### Timeline
- **Due Date**: Select when the loan should be repaid
- Must be at least 24 hours from creation date

#### Terms & Conditions
- **Terms**: Detailed terms and conditions of the loan
- Include repayment schedule, collateral information, special conditions

### Step 3: Submit Agreement
1. Review all entered information
2. Click "Create Agreement"
3. The system will:
   - Generate a SHA-256 hash of the agreement
   - Submit the hash to Hedera blockchain for immutability
   - Create a PENDING agreement record
   - Notify the borrower

## Managing Agreements

### Agreement Statuses
- **PENDING**: Created, waiting for borrower acceptance
- **ACTIVE**: Borrower has accepted, loan is active
- **COMPLETED**: Fully repaid
- **DEFAULTED**: Payment overdue
- **REJECTED**: Borrower rejected the agreement

### For Lenders
1. View all agreements in Dashboard
2. Track status changes
3. Monitor payment history
4. Verify agreement integrity on blockchain

### For Borrowers
1. View received agreements in Dashboard
2. **Accept**: Click to agree to terms and activate the loan
3. **Reject**: Decline the loan offer
4. Track repayment schedule
5. Record payments as they're made

### Agreement Actions
- **View Details**: Click on any agreement to see full terms
- **Verify on Blockchain**: Check agreement integrity against Hedera network
- **Payment History**: View all recorded payments
- **Status Updates**: Real-time status changes

## Recording Payments

### Step 1: Select Agreement
1. Navigate to the specific agreement
2. Click "Record Payment"

### Step 2: Enter Payment Details
- **Payment Amount**: Amount paid (in KES)
- **Payment Date**: Date of payment (defaults to today)
- **Notes**: Optional notes about the payment

### Step 3: Submit Payment
1. Review payment information
2. Click "Record Payment"
3. Payment is immediately added to the agreement history
4. Both lender and borrower can view the payment

### Payment Tracking
- All payments are timestamped and immutable
- Running balance is calculated automatically
- Payment history is always accessible

## Blockchain Verification

### What is Blockchain Verification?
SafeLedger uses Hedera Consensus Service to create an immutable record of every agreement. This ensures:
- Agreement cannot be tampered with
- Proof of existence at specific time
- Cryptographic verification of integrity

### How to Verify
1. Open any agreement details
2. Click "Verify on Blockchain"
3. System checks if the agreement hash exists on Hedera
4. Returns verification status:
   - ✅ **Verified**: Agreement hash found on blockchain
   - ❌ **Not Found**: Agreement not yet submitted or verification failed

### Verification Process
- Agreement hash is automatically submitted when created
- Verification checks against Hedera Consensus Service
- Process typically takes 3-5 seconds
- Failed verifications are automatically retried

## Trust Score System

### What is Trust Score?
A numerical representation (0-100) of a user's reliability based on:
- Successful loan repayments
- Timely payments
- Agreement completion rate
- Default history

### Score Calculation
- **Starting Score**: 0 for new users
- **Positive Actions**: +1-5 points per successful action
- **Negative Actions**: -5-20 points per default/rejection
- **Maximum Score**: 100 points

### Score Impact
- Higher scores increase borrowing opportunities
- Lenders prefer high-trust-score borrowers
- Scores are publicly visible (except exact values)
- Score history is tracked over time

### Improving Your Score
1. Always repay loans on time
2. Accept reasonable loan terms
3. Complete agreements successfully
4. Maintain consistent positive behavior
5. Avoid defaults and rejections

## Security Features

### Data Encryption
- **Personal Information**: AES-256 encryption
- **Agreement Terms**: Encrypted storage
- **Communication**: HTTPS/TLS encryption

### Authentication Security
- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt encryption
- **Session Expiration**: 7-day automatic logout

### Blockchain Security
- **Immutability**: Once recorded, cannot be changed
- **Cryptographic Hashes**: SHA-256 for integrity
- **Decentralized Verification**: Hedera network validation

### Privacy Protection
- **Phone Number Privacy**: Only shown to agreement participants
- **Data Minimization**: Only collect necessary information
- **User Control**: Users control their data sharing

## Troubleshooting

### Common Issues

#### Registration Problems
**Issue**: "Phone number already registered"
- Solution: Use "Forgot Password" or contact support
- Cause: Phone number must be unique

**Issue**: "Invalid phone number format"
- Solution: Use Kenyan format (07xxxxxxxx or +2547xxxxxxxx)
- Cause: System validates Kenyan phone formats

#### Login Issues
**Issue**: "Invalid credentials"
- Solution: Check phone number and password spelling
- Cause: Incorrect login information

**Issue**: "Account not found"
- Solution: Verify you're registered with correct phone number
- Cause: Phone number not in system

#### Agreement Issues
**Issue**: "Borrower not found"
- Solution: Ensure borrower is registered with exact phone number
- Cause: Borrower phone number not in system

**Issue**: "Agreement verification failed"
- Solution: Wait 30 seconds and retry verification
- Cause: Blockchain transaction processing delay

#### Payment Issues
**Issue**: "Payment amount invalid"
- Solution: Enter positive numbers only
- Cause: Invalid payment amount format

### Getting Help

#### In-App Support
1. Check error messages for specific guidance
2. Try refreshing the page
3. Clear browser cache and cookies

#### Contact Support
- **Email**: support@safeledger.dev
- **Phone**: [Support phone number]
- **Response Time**: Within 24 hours

#### FAQ Section
Visit our FAQ section for quick answers to common questions about:
- Account management
- Agreement creation
- Payment processing
- Security concerns
- Blockchain verification

### Best Practices

#### For Lenders
1. Always verify borrower registration before creating agreements
2. Use clear, specific terms and conditions
3. Set reasonable interest and penalty rates
4. Document all payments promptly
5. Regularly verify agreements on blockchain

#### For Borrowers
1. Read and understand all terms before accepting
2. Only accept loans you can realistically repay
3. Record payments immediately after making them
4. Communicate with lenders if payment issues arise
5. Maintain good trust score through responsible behavior

#### General Security
1. Use strong, unique passwords
2. Never share your login credentials
3. Log out after each session
4. Keep your phone number updated
5. Report suspicious activity immediately

---

## Need More Help?

If you need additional assistance or have questions not covered in this guide, please don't hesitate to contact our support team. We're here to help you make the most of SafeLedger's secure lending platform.

**SafeLedger - Building Trust in Informal Finance**
