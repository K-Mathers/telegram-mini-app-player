export function useTelegram() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return null;

  return {
    tg,
    user: tg.initDataUnsafe?.user,
    initData: tg.initData,
    closeApp: () => tg.close(),
  };
}
