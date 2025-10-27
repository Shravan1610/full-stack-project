'use client';

import { ShoppingBag, Package, Heart, Sparkles, User as UserIcon, LogOut, LayoutDashboard, MapPin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/shared-ui";
import { Button } from "@repo/shared-ui";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/shared-ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/shared-ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/shared-ui";
import { Menu } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    icon: JSX.Element;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
}

const Navbar1 = ({
  logo = {
    url: "/",
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "ShoeHub",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Shop",
      url: "/products",
      items: [
        {
          title: "All Shoes",
          description: "Browse our complete footwear collection",
          icon: <Package className="size-5 shrink-0" />,
          url: "/products",
        },
        {
          title: "Men's Shoes",
          description: "Stylish footwear for men - sneakers, boots & more",
          icon: <Sparkles className="size-5 shrink-0" />,
          url: "/products?category=men",
        },
        {
          title: "Women's Shoes",
          description: "Elegant heels, flats, sneakers & sandals",
          icon: <Heart className="size-5 shrink-0" />,
          url: "/products?category=women",
        },
        {
          title: "Kids' Shoes",
          description: "Comfortable and durable shoes for children",
          icon: <Sparkles className="size-5 shrink-0" />,
          url: "/products?category=kids",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      items: [
        {
          title: "Sneakers",
          description: "Athletic and casual sneakers",
          icon: <Package className="size-5 shrink-0" />,
          url: "/products?category=sneakers",
        },
        {
          title: "Boots",
          description: "Winter boots and ankle boots",
          icon: <Package className="size-5 shrink-0" />,
          url: "/products?category=boots",
        },
        {
          title: "Sandals",
          description: "Summer sandals and flip-flops",
          icon: <Sparkles className="size-5 shrink-0" />,
          url: "/products?category=sandals",
        },
        {
          title: "Formal Shoes",
          description: "Dress shoes and business footwear",
          icon: <Heart className="size-5 shrink-0" />,
          url: "/products?category=formal",
        },
      ],
    },
  ],
  mobileExtraLinks = [
    { name: "New Arrivals", url: "/products?sort=newest" },
    { name: "Best Sellers", url: "/products?featured=true" },
    { name: "Sale", url: "/products?sale=true" },
    { name: "My Orders", url: "/account/orders" },
    { name: "Addresses", url: "/account/addresses" },
  ],
}: Navbar1Props) => {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <section className="py-4 border-b bg-white sticky top-0 z-50 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/95">
      <div className="container">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href={logo.url} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {logo.icon}
              <span className="text-xl font-bold">{logo.title}</span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Desktop Auth & Cart */}
          <div className="flex gap-2 items-center">
            {/* Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{profile?.full_name || 'My Account'}</span>
                      <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/addresses" className="cursor-pointer">
                      <MapPin className="mr-2 h-4 w-4" />
                      Addresses
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              {logo.icon}
              <span className="text-xl font-bold">{logo.title}</span>
            </Link>
            
            <div className="flex items-center gap-2">
              {/* Mobile Cart Button */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        {logo.icon}
                        <span className="text-lg font-semibold">{logo.title}</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-6 flex flex-col gap-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    
                    <div className="border-t py-4">
                      <div className="grid grid-cols-2 justify-start gap-2">
                        {mobileExtraLinks.map((link, idx) => (
                          <Link
                            key={idx}
                            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                            href={link.url}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {user ? (
                      <div className="flex flex-col gap-3 border-t pt-4">
                        <div className="px-2 py-2 text-sm">
                          <p className="font-medium">{profile?.full_name || 'My Account'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link href="/account/profile">
                          <Button variant="outline" className="w-full justify-start">
                            <UserIcon className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Link href="/account/orders">
                          <Button variant="outline" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" />
                            My Orders
                          </Button>
                        </Link>
                        <Link href="/account/addresses">
                          <Button variant="outline" className="w-full justify-start">
                            <MapPin className="mr-2 h-4 w-4" />
                            My Addresses
                          </Button>
                        </Link>
                        {profile?.role === 'admin' && (
                          <Link href="/admin">
                            <Button variant="outline" className="w-full justify-start">
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="outline">
                          <Link href="/auth/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/auth/signup">Sign Up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <Link
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <Link
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </Link>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </Link>
  );
};

export { Navbar1 };
