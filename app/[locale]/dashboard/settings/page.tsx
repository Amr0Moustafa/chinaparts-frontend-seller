import { StoreSettingsTemplate } from "@/components/template/SettingTemplate";


export default async function Settings() {
  return (
    <section id="settings-page" className=" min-h-screen ">
      <StoreSettingsTemplate/>
    </section>
  );
}