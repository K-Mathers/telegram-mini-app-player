import "./page.css";
import { Page, PageHeader } from "@/shared/ui/page";
import { COMMUNITY_LINKS } from "@/shared/config/constants";
import { Button } from "@/shared/ui/button";

interface Ipage {}

export const MorePage = ({}: Ipage) => {
  return (
    <Page>
      <PageHeader title="Settings" />

      <h2 className="more-subheader-title">Community</h2>

      <div className="community-grid">
        {COMMUNITY_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            className="community-card"
          >
            <div className="community-card-top">
              <div className="community-card-icon">{link.icon}</div>
              <div className="community-card-text">
                <p className="community-card-title">{link.title}</p>
                <p className="community-card-description">{link.description}</p>
              </div>
            </div>
            <Button>{link.buttonText}</Button>
          </a>
        ))}
      </div>
    </Page>
  );
};
