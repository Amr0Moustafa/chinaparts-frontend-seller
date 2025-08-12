export const DashboardPreview = () => (
  <div
    className="hidden xl:block relative w-full h-full"
    style={{
      backgroundImage: "url('/images/auth/bg_auth.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <img
      src="/images/auth/dash_img.png"
      alt="Dashboard Preview"
      className="absolute top-20 right-0 w-[400px] xl:w-[600px] 2xl:w-[1000px] rounded-xl shadow-lg transition-all"
    />
  </div>
);
