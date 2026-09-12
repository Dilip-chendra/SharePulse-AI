# 00. Master Data Dictionary & Schema Definitions

| Field Name | Source Table | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `Customer_ID` | Customer & Transactions | Integer | Unique identifier for MetroMart customers (1 to 45,000) |
| `Age` | Customer Data | Integer | Age of customer |
| `Membership_Type` | Customer Data | String | Loyalty membership tier (`Prime` or `Non-Prime`) |
| `Credit_Card_Open_Date` | Customer Data | Date | Date HSIC co-branded card was issued (Null for non-cardholders) |
| `Credit_Card_Closed_Date` | Customer Data | Date | Date card was closed (Null if active) |
| `Credit_Card_Limit` | Customer Data | Numeric | Total approved revolving credit line |
| `Credit_Card_APR` | Customer Data | Numeric | Annual Percentage Rate on HSIC card |
| `Transaction_ID` | Transactions Data | Integer | Unique transaction identifier |
| `Transaction_Date` | Transactions Data | Date | Date transaction occurred |
| `Transaction_Amount` | Transactions Data | Numeric | Absolute currency amount in INR |
| `Transaction_Type` | Transactions Data | String | `Sale` or `Return` |
| `Category_Code` | Transactions & Category | Integer | Foreign key for product category (1 to 10) |
| `Category` | Category Code | String | Product category name |
| `Payment_Code` | Transactions & Payment | Integer | Foreign key for payment rail (1 to 5) |
| `Payment_Method` | Payment Code | String | Payment method name (`HSIC Bank Credit Card`, `MetroMart Wallet`, `Cash/UPI`, `Debit Card`, `Other Bank Credit Card`) |
