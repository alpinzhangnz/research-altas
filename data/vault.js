export const Vault = {
  getBalance() {
    return parseFloat(localStorage.getItem('atlas_vault_balance') || '0');
  },

  addFunds(amount) {
    const current = this.getBalance();
    const newVal = current + amount;
    localStorage.setItem('atlas_vault_balance', newVal.toFixed(2));
    return newVal;
  },

  withdrawAll() {
    const amount = this.getBalance();
    localStorage.setItem('atlas_vault_balance', '0');
    return amount;
  }
};
