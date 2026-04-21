# Web Uygulamasi

Bu klasor, Angular istemcisinin shell tabanli router yapisini, cekirdek cross-cutting katmanlarini ve feature ailelerini barindirir.

Bu alana route shell'leri, bootstrap akisi, `core/` altindaki auth ve layout gibi ortak sorumluluklar ile `features/` altindaki domain modulleri girer. Firestore'a dogrudan baglanan daginik script'ler, ops artefact'lari ve backend trusted write mantigi burada yer almaz.

Ana referanslar: `docs/architecture/angular-application-architecture.md`, `docs/architecture/repo-and-folder-standards.md`