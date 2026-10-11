import { InventoryText as Text } from "./InventoryText";
import { profile } from "../config/profile-config";
export function ProfilePanel() {
  const fields = [
    ["作者：", profile.name],
    ["学校：", profile.school],
    ["兴趣：", profile.interests],
    ["网站名：", profile.websiteName],
    ["定位：", profile.purpose],
    ["简介：", profile.biography],
    ["格言：", profile.motto],
  ];
  return (
    <section className="profile-panel" aria-label="作者简介">
      <h1>
        <Text text="作者简介" />
      </h1>
      <div className="profile-subtitle">
        <Text text="PLAYER PROFILE" color="#aaa" />
      </div>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>
              <Text text={label} color="#aaa" />
            </dt>
            <dd>
              <Text text={value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
