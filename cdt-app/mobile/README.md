# CDT Mobile (Capacitor)

Este wrapper usa Capacitor para empacotar o app web em um APK Android.

## Pré-requisitos
- Node.js 18+
- Android Studio com Android SDK, Java 17, e variáveis `ANDROID_HOME` configuradas

## Passos
1. No diretório `mobile`, instale dependências:
   ```bash
   npm i
   ```
2. Edite `capacitor.config.ts` e defina `server.url` para apontar para sua URL pública do app (ex.: `https://xxxx.trycloudflare.com`) ou `http://10.0.2.2:8080` se rodar o servidor local no computador enquanto testa no emulador.
3. Sincronize e gere projeto Android:
   ```bash
   npx cap add android
   npx cap sync android
   ```
4. Build APK com Gradle:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   O APK estará em `android/app/build/outputs/apk/debug/app-debug.apk`.

Para compartilhar um link de download, faça upload do APK em um serviço de compartilhamento (ex.: Google Drive) e compartilhe o link público.