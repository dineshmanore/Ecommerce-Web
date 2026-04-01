import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto border-t border-white/5 relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Identity */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="bg-gradient-to-tr from-primary-600 to-accent-500 p-2 rounded-xl text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                SMART<span className="text-primary-500">CART</span>
              </span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-sm">
              Redefining your shopping experience with curated premium products and seamless technology.
            </p>
            <div className="flex items-center gap-4">
              {[
                { name: 'Twitter', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', href: 'https://x.com/dinesh_manore' },
                { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', href: 'https://instagram.com/dinesh._.44' },
              ].map((social) => (
                <a key={social.name} href={social.href} target="_blank" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 hover:-translate-y-1 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Shop</h3>
              <ul className="space-y-4">
                <li><Link to="/products" className="hover:text-primary-400 transition-colors">All Collections</Link></li>
                <li><Link to="/products?featured=true" className="hover:text-primary-400 transition-colors">New Arrivals</Link></li>
                <li><Link to="/wishlist" className="hover:text-primary-400 transition-colors">Wishlist</Link></li>
                <li><Link to="/cart" className="hover:text-primary-400 transition-colors">Your Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Help</h3>
              <ul className="space-y-4">
                <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-primary-400 transition-colors">Shipping</Link></li>
                <li><Link to="/returns" className="hover:text-primary-400 transition-colors">Returns</Link></li>
                <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h3>
              <p className="text-sm text-gray-500 mb-4 truncate">Join our elite circle for early access.</p>
              <div className="flex flex-col gap-2">
                 <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-500" />
                 <button className="btn-accent btn-sm rounded-xl py-2.5">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium tracking-tight">
            &copy; {new Date().getFullYear()} <span className="text-gray-400 font-bold">SMART<span className="text-primary-500">CART</span></span>. Crafted with precision.
          </p>
          <div className="flex gap-6 text-xs font-bold text-gray-600 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
