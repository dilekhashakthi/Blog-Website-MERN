import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import React from "react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitterX,
} from "react-icons/bs";
import { Link } from "react-router-dom";

const FooterComp = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-linear-to-r from-slate-900 via-teal-500 to-cyan-400 rounded-lg text-white">
                Nexora
              </span>
              <span className="text-black dark:text-white">Blogs</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3">
            <div>
              <FooterTitle title="About" />
              <FooterLinkGroup col>
                <FooterLink
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About Us
                </FooterLink>

                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Our Story
                </FooterLink>

                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Careers
                </FooterLink>
              </FooterLinkGroup>
            </div>

            <div>
              <FooterTitle title="Follow us" />
              <FooterLinkGroup col>
                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  TwitterX
                </FooterLink>

                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Instagram
                </FooterLink>

                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  GitHub
                </FooterLink>
              </FooterLinkGroup>
            </div>

            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col>
                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </FooterLink>

                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Terms &amp; Conditions
                </FooterLink>

                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Cookie Policy
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>

        <FooterDivider />

        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright
            href="#"
            by="Nexora Blog"
            year={new Date().getFullYear()}
          />

          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitterX} />
            <FooterIcon href="#" icon={BsGithub} />
            <FooterIcon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
