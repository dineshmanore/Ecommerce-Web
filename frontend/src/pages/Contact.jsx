import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent (fake). Connect backend later.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
        />

        <textarea
          placeholder="Your Message"
          className="w-full p-3 border rounded-lg"
          rows="5"
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value})}
        />

        <button className="bg-primary-600 text-white px-6 py-3 rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  );
}