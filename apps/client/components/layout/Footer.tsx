import Link from 'next/link';
import { Facebook, Instagram, Twitter, ShoppingBag } from 'lucide-react';
import { Input } from '@repo/shared-ui';
import { Button } from '@repo/shared-ui';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">StyleHub</span>
            </div>
            <p className="text-sm mb-4">
              Your destination for premium fashion and timeless style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/products?category=women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/help/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/help/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/help/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} StyleHub. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
