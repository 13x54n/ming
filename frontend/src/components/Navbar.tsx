"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Identicon from "react-identicons";
import { useSDK } from "@metamask/sdk-react";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const accounts = await sdk?.connect();
      localStorage.setItem("ming_is_wallet_persistent", "true");
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
    setIsConnecting(false);
  };

  const disconnectWallet = async () => {
    try {
      await sdk?.disconnect();
      localStorage.removetItem("ming_is_wallet_persistent");
    } catch (error) {
      console.warn("failed to disconnect..", error);
    }
  };

  /**
   * @documentation The following useEffect hook works in following order:
   * 1. Check if wallet is already connected
   * 2. Connect to Metamask SDK
   * 3. If true then get the wallet public address from Metamask
   * 4. Assign response account to variable
   * 
   * @dev but this won't work for mobile devices
   */
  useEffect(() => {
    const isWalletPersistent = localStorage.getItem(
      "ming_is_wallet_persistent"
    );

    setIsConnecting(true);
    if (isWalletPersistent === "true") {
      (async () => {
        try {
          if (!window.ethereum) {
            console.log(
              "Please install MetaMask or another Ethereum provider."
            );
            return;
          }

          await sdk?.connect();

          const accounts: any = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts?.[0]);
        } catch (err: any) {
          if (err?.code === 4001) {
            console.log("Please connect to MetaMask.");
          } else {
            console.error("Failed to connect:", err);
          }
        }
      })();
      setIsConnecting(false);
    }
  }, []);

  return (
    <header className="bg-white border-b-2">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 py-4 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img alt="" src="/logo.png" className="h-8 w-auto" />
            <span className="logoText text-2xl">Ming</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 focus:outline-none">
              Product
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                  >
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none text-gray-400"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Features
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Marketplace
          </a>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isConnecting ? (
            <>Connecting Wallet...</>
          ) : connected ? (
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 flex items-center font-semibold rounded-lg p-2 text-sm gap-2">
                <Identicon
                  string={account}
                  size={20}
                  className="border-2 border-gray-300"
                />
                <p>
                  {account &&
                    account.substring(0, 6) + "..." + account.slice(-3)}
                </p>
              </div>
              <button
                className="flex items-center gap-1 bg-black text-white logoText px-2 py-1 rounded-lg"
                onClick={() => disconnectWallet()}
              >
                <i className="ri-logout-circle-r-line"></i> Disconnect
              </button>
            </div>
          ) : (
            <button style={{ padding: 10, margin: 10 }} onClick={connect}>
              Connect
            </button>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>
              <div className="py-6">
                {isConnecting ? (
                  <>Connecting Wallet...</>
                ) : connected ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 flex items-center font-semibold rounded-lg p-2 text-sm gap-2">
                      <Identicon
                        string={account}
                        size={20}
                        className="border-2 border-gray-300"
                      />
                      <p>
                        {account &&
                          account.substring(0, 6) + "..." + account.slice(-3)}
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-1 bg-black text-white logoText px-2 py-1 rounded-lg"
                      onClick={() => disconnectWallet()}
                    >
                      <i className="ri-logout-circle-r-line"></i> Disconnect
                    </button>
                  </div>
                ) : (
                  <button style={{ padding: 10, margin: 10 }} onClick={connect}>
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
