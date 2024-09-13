import React from "react";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";

export const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1d292c] py-4 px-8 text-white">
    <div className="flex justify-center items-center gap-4">
      <Link
        href="https://gotbit-faucet-backend-qa.test.gotbit.app/"
        passHref
        className="btn btn-primary btn-sm font-normal gap-1"
      >
        <span>Faucets</span>
      </Link>

            <Link
              href="https://testnet.xendrwachain.com/"
              passHref
              className="btn btn-primary btn-sm font-normal gap-1 flex text-white"
            >
              {/* <MagnifyingGlassIcon className="h-4 w-4" /> */}
              <span>Block Explorer</span>
            </Link>
            <span>·</span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center text-white">
                Built with <HeartIcon className="inline-block h-4 w-4" /> at
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://buidlguidl.com/"
                target="_blank"
                rel="noreferrer"
              >
                🔗
                <span className="link text-white">AssetChain</span>
              </a>
            </div>
            <span>·</span>
            {/* <div className="text-center">
              <a
                href="https://t.me/Oxkodesage"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                Support
              </a>
            </div> */}
          
      </div>
    </div>
  );
};
