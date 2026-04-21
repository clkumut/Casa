# Firebase Baseline

Bu klasor, Firebase platformuna ait güvenli baslangic artefact'larini toplar.

Bu alana Firestore rules, Firestore indexes, Storage rules ve proje kimligi gerektirmeyen emulator odakli baseline config girer. Gercek proje id, `.firebaserc`, deploy hedefi veya gizli ortam bilgileri burada tutulmaz.

Bu klasor, emulator paritesi ve guvenli default-deny kurallariyla baslar; acik izinler yalniz onayli mimari ve security kararlari sonrasi eklenir.

Ana referanslar: `docs/architecture/firebase-platform-architecture.md`, `docs/ops/emulator-strategy.md`, `docs/ops/firebase-environments.md`