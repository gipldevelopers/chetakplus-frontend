const fs = require('fs');
let content = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// I am just going to put the correct entire form back between
// { (savedAddresses.length === 0 || selectedAddressId === "new") && (
// and 
// <div className="lg:col-span-5">

const parts = content.split('{ (savedAddresses.length === 0 || selectedAddressId === "new") && (\n                  <>');

if (parts.length < 2) {
    console.error("Could not find start");
    process.exit(1);
}

const subParts = parts[1].split('          <div className="lg:col-span-5">');

if (subParts.length < 2) {
    console.error("Could not find end");
    process.exit(1);
}

const middleBlock = `
                    <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-6">Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          list="checkout-address-suggestions"
                          placeholder="Apartment, suite, etc."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                        <datalist id="checkout-address-suggestions">
                          {addressSuggestions.map((address) => (
                            <option key={address} value={address} />
                          ))}
                        </datalist>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">PIN Code</label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-6">Payment</h2>
                <div className="space-y-3">
                  {checkoutSettings.enableCod ? (
                    <label className={\`block p-4 rounded-xl border cursor-pointer \${paymentMethod === "Cash on Delivery" ? "border-primary bg-primary/5" : "border-border bg-background"}\`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="mr-2"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                      />
                      <span className="font-medium text-foreground">Cash on Delivery</span>
                      <p className="text-xs text-muted-foreground mt-1">Payment stays pending until admin marks it received.</p>
                    </label>
                  ) : null}

                  {checkoutSettings.enableUpi ? (
                    <label className={\`block p-4 rounded-xl border cursor-pointer \${paymentMethod === "UPI" ? "border-primary bg-primary/5" : "border-border bg-background"}\`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="mr-2"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                      />
                      <span className="font-medium text-foreground">UPI</span>
                      <p className="text-xs text-muted-foreground mt-1">Order is placed first. Payment is verified by admin before confirmation.</p>
                    </label>
                  ) : null}
                </div>

                {paymentMethod === "UPI" ? (
                  <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-xl">
                    <div className="flex items-start gap-4">
                      <CreditCard className="text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">UPI Payment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          UPI ID: <span className="font-semibold text-foreground">{checkoutSettings.upiId || "Not configured"}</span>
                        </p>
                        {(checkoutSettings.upiQrImageUrl || checkoutSettings.upiId) ? (
                          <img
                            src={getImageUrl(checkoutSettings.upiQrImageUrl || generateUpiQrUrl(checkoutSettings.upiId))}
                            alt="UPI QR"
                            className="mt-3 w-28 h-28 rounded-lg border border-border bg-background"
                          />
                        ) : null}
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">
                            UPI Transaction Reference {checkoutSettings.requireUpiReference ? "*" : "(Optional)"}
                          </label>
                          <input
                            type="text"
                            value={upiTransactionRef}
                            onChange={(e) => setUpiTransactionRef(e.target.value)}
                            placeholder="Enter UPI txn ref"
                            className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

              </div>
            </ScrollReveal>
          </div>

          {/* Right Block - Order Summary */}
          <div className="lg:col-span-5">`;

fs.writeFileSync('src/pages/Checkout.jsx', parts[0] + '{ (savedAddresses.length === 0 || selectedAddressId === "new") && (\n                  <>' + middleBlock + subParts[1]);
console.log('Fixed');
