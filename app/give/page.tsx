'use client'

import { useState } from 'react'

export default function GivePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    givingType: 'donation',
    amount: '',
    customAmount: '',
    paymentMethod: '',
    message: '',
  })
  const [error, setError] = useState('')

  const givingTypes = [
    { id: 'donation', label: 'General Donation', emoji: '❤️' },
    { id: 'offering', label: 'Church Offering', emoji: '⛪' },
    { id: 'seed', label: 'Seed Sowing', emoji: '🌱' },
  ]

  const predefinedAmounts = [50, 100, 250, 500, 1000, 5000]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAmountClick = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
      customAmount: '',
    }))
  }

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      customAmount: value,
      amount: '',
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = formData.amount || formData.customAmount
    if (!finalAmount) {
      setError('Please select or enter an amount.')
      return
    }
    if (!formData.paymentMethod) {
      setError('Please choose a payment method: Bank Card or Mobile Money.')
      return
    }
    setError('')
    // Wire up to payment gateway here
    console.log('Form submitted:', formData, 'Final Amount:', finalAmount)
  }

  const finalAmount = formData.amount || formData.customAmount

  return (
    <>
      {/* Header */}
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #96700f 100%)' }}
      >
        <div className="relative z-10">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Give</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--gold)' }} />
          <p className="text-white/90 text-lg mt-6 max-w-2xl mx-auto">
            "It is more blessed to give than to receive." - Acts 20:35
          </p>
        </div>
      </section>
      <div className="gold-bar" />

      {/* Donation Form */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div
            className="px-5 py-8 sm:px-8 sm:py-12 text-white"
            style={{ background: 'linear-gradient(135deg, var(--brand-dark) 0%, #96700f 100%)' }}
          >
            <h2 className="font-heading text-3xl font-bold mb-2">Support Our Ministry</h2>
            <p className="text-white/90">Make a tax-deductible contribution to advance the Kingdom of God</p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 lg:p-12 space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--brand-dark)' }}>
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-brand-main"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-brand-main"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+233 XXX XXX XXX"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-brand-main"
                  />
                </div>
              </div>
            </div>

            {/* Giving Type */}
            <div>
              <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--brand-dark)' }}>
                Type of Giving
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {givingTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, givingType: type.id }))}
                    className={`p-4 rounded-lg border-2 font-medium transition-all text-center flex items-center justify-center gap-2 ${
                      formData.givingType === type.id
                        ? 'border-white text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                    style={{
                      background: formData.givingType === type.id ? 'var(--brand-dark)' : '#fcfaf5',
                    }}
                  >
                    <span className="text-xl">{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--brand-dark)' }}>
                Donation Amount
              </h3>

              {/* Predefined Amounts */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Select a preset amount:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      className={`px-4 py-3 rounded-lg font-bold transition-all border-2 ${
                        formData.amount === amount.toString()
                          ? 'text-white border-white'
                          : 'text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                      style={{
                        background: formData.amount === amount.toString() ? 'var(--brand-dark)' : '#fcfaf5',
                      }}
                    >
                      ₵{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <p className="text-sm text-gray-600 mb-3">Or enter a custom amount:</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-700 bg-gray-100 px-4 py-3 rounded-lg">₵</span>
                  <input
                    type="number"
                    name="customAmount"
                    placeholder="Enter amount"
                    value={formData.customAmount}
                    onChange={handleCustomAmount}
                    min="0"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-brand-main"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--brand-dark)' }}>
                Payment Method *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'card', label: 'Bank Card', emoji: '💳', description: 'Visa, Mastercard, or other debit/credit cards' },
                  { id: 'momo', label: 'Mobile Money', emoji: '📱', description: 'mPesa, Vodafone Cash, or other mobile payment' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, paymentMethod: method.id }))
                      setError('')
                    }}
                    className={`p-4 rounded-lg border-2 font-medium transition-all text-left ${
                      formData.paymentMethod === method.id
                        ? 'border-white text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                    style={{
                      background: formData.paymentMethod === method.id ? 'var(--brand-dark)' : '#fcfaf5',
                    }}
                  >
                    <div className="text-2xl mb-2">{method.emoji}</div>
                    <div className="font-bold">{method.label}</div>
                    <div className={`text-xs mt-1 ${formData.paymentMethod === method.id ? 'text-white/80' : 'text-gray-600'}`}>
                      {method.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Add a prayer request, praise, or message..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-brand-main resize-none"
              />
            </div>

            {/* Summary */}
            {finalAmount && (
              <div
                className="p-4 rounded-lg border-2"
                style={{
                  background: 'var(--brand-pale)',
                  borderColor: 'var(--brand-dark)',
                }}
              >
                <p className="text-sm text-gray-600 mb-1">Total Amount to Give:</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-dark)' }}>
                  ₵{finalAmount}
                </p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!finalAmount}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:shadow-lg transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, var(--brand-dark) 0%, #96700f 100%)' }}
            >
              {finalAmount ? `Proceed to Payment (₵${finalAmount})` : 'Select an Amount'}
            </button>

            {/* Tax Notice */}
            <div className="p-4 rounded-lg bg-brand-pale border-l-4 border-gold">
              <p className="text-sm text-brand-dark">
                <span className="font-semibold">📄 Tax Receipt:</span> A tax-deductible receipt will be provided for your records.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="py-12" />
    </>
  )
}
