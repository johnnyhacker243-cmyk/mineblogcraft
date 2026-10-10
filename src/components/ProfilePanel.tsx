import { InventoryText as Text } from "./InventoryText";
import { profile } from "../config/profile-config";
export function ProfilePanel() {
  return (
    <section className="profile-panel" aria-label="作者简介">
      <h1>
        <Text text="作者简介" />
      </h1>
      <div className="profile-subtitle">
        <Text text="PLAYER PROFILE" color="#aaa" />
      </div>
      <dl>
        <div>
          <dt>
            <Text text="名称：" color="#aaa" />
          </dt>
          <dd>
            <Text text={profile.name} />
          </dd>
        </div>
        <div>
          <dt>
            <Text text="身份：" color="#aaa" />
          </dt>
          <dd>
            <Text text={profile.identity} />
          </dd>
        </div>
        <div>
          <dt>
            <Text text="技术方向：" color="#aaa" />
          </dt>
          <dd>
            <Text text={profile.interests} />
          </dd>
        </div>
        <div>
          <dt>
            <Text text="网站定位：" color="#aaa" />
          </dt>
          <dd>
            <Text text={profile.purpose} />
          </dd>
        </div>
        <div>
          <dt>
            <Text text="个人简介：" color="#aaa" />
          </dt>
          <dd>
            {profile.biography.map((line) => (
              <Text key={line} text={line} />
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
}
