# 29. Analytical Limitations & What the Data Cannot Prove

Analytical rigor requires clear disclosure of dataset boundaries and unobservable dimensions. The following items **cannot be proven** from the available data:

### 1. Refund Turnaround & Settlement Latency
- **Limitation**: While transaction types distinguish `Sale` and `Return` (showing a 4.8% return rate by value), the ledger does **not** record the exact timestamp when refund funds were settled into customer bank accounts.
- **Boundary**: Claims that "slow return processing causes customer defection" remain an **untestable hypothesis**.

### 2. External Competitor Marketing & APR Sensitivity
- **Limitation**: Customer credit limits and APRs are recorded in the customer master, but external competitor credit card APRs, promotional cashback rates, and off-us spend outside MetroMart are not observed.
- **Boundary**: We cannot observe whether a customer who ceased HSIC usage is using their card elsewhere or simply using a competitor card with a higher credit limit.

### 3. Causal Uplift vs Observational Correlation
- **Limitation**: The dataset contains observational transaction histories without pre-existing randomized A/B test campaign treatment tags or control holdouts.
- **Boundary**: All intervention recovery estimates are **modelled scenarios** based on behavioral proxies and require validation through the proposed randomized pilot trial designs (`evidence_pack/23_experiment_framework.csv`).
