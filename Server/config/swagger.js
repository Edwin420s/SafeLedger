const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SafeLedger API',
      version: '1.0.0',
      description: 'Hedera-based secure lending platform API documentation',
      contact: {
        name: 'SafeLedger Team',
        email: 'support@safeledger.dev'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.safeledger.dev',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            trustScore: {
              type: 'number',
              description: 'User trust score'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        Agreement: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Agreement unique identifier'
            },
            lenderId: {
              type: 'string',
              format: 'uuid',
              description: 'Lender user ID'
            },
            borrowerId: {
              type: 'string',
              format: 'uuid',
              description: 'Borrower user ID'
            },
            amount: {
              type: 'number',
              description: 'Loan amount'
            },
            interestRate: {
              type: 'number',
              description: 'Annual interest rate (%)'
            },
            penaltyRate: {
              type: 'number',
              description: 'Monthly penalty rate (%)'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Loan due date'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'REJECTED'],
              description: 'Agreement status'
            },
            terms: {
              type: 'string',
              description: 'Loan terms and conditions'
            },
            hash: {
              type: 'string',
              description: 'SHA-256 hash of agreement'
            },
            hederaTxId: {
              type: 'string',
              description: 'Hedera transaction ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Agreement creation date'
            }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Payment unique identifier'
            },
            agreementId: {
              type: 'string',
              format: 'uuid',
              description: 'Associated agreement ID'
            },
            amount: {
              type: 'number',
              description: 'Payment amount'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Payment date'
            },
            notes: {
              type: 'string',
              description: 'Payment notes'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
