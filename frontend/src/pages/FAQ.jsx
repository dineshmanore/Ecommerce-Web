export default function FAQ() {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Browse products, add to cart, and proceed to checkout."
    },
    {
      q: "What payment methods are available?",
      a: "We support UPI, cards, and net banking."
    },
    {
      q: "How long does delivery take?",
      a: "Usually 3–7 business days."
    },
    {
      q: "Can I return a product?",
      a: "Yes, within 7 days of delivery."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">FAQ</h1>

      <div className="space-y-6">
        {faqs.map((item, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="text-gray-600 mt-2">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}