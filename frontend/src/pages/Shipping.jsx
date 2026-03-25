export default function Shipping() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>

      <div className="space-y-4 text-gray-600">
        <p>We offer fast and reliable shipping across India.</p>

        <ul className="list-disc pl-5 space-y-2">
          <li>Orders above ₹500 → FREE shipping</li>
          <li>Delivery time: 3–7 business days</li>
          <li>Express delivery available in metro cities</li>
          <li>Tracking details sent via email/SMS</li>
        </ul>
      </div>
    </div>
  );
}