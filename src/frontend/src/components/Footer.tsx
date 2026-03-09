import { Separator } from "@/components/ui/separator";
import { Heart, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "unknown-app";

  const phoneNumber = "085259008382";
  // wa.me requires international format; Indonesian numbers start with 0, replace with country code 62
  const waNumber = phoneNumber.startsWith("0")
    ? `62${phoneNumber.slice(1)}`
    : phoneNumber;

  return (
    <footer className="bg-card border-t-2 border-border">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Branding */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">SUMOJI</h3>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>DKI Jakarta</span>
              </div>
              <div className="flex items-center gap-2">
                <SiWhatsapp className="h-4 w-4 flex-shrink-0 text-[#25D366]" />
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors hover:underline"
                >
                  {phoneNumber}
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear}. Built with{" "}
            <Heart className="inline h-4 w-4 text-primary fill-primary" /> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-6">
            <button
              type="button"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
