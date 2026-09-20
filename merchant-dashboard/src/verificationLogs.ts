export type VerificationStatus = 'APPROVED' | 'EDITED_ADDRESS' | 'SMS_FALLBACK' | 'CANCELLED';

export interface LogTimelineEvent {
  time: string;
  title: string;
  desc: string;
  type: 'order' | 'dispatch' | 'read' | 'action' | 'fallback' | 'cancel' | 'saved';
  badge?: string;
}

export interface VerificationLogItem {
  id: string;
  customer: string;
  phone: string;
  status: VerificationStatus;
  channel: string;
  city: string;
  amount: string;
  time: string;
  responseTime: string;
  warehouseAction: string;
  costSaved?: string;
  updatedAddress?: string;
  history: LogTimelineEvent[];
}

export function getVerificationLogs(lang: 'sr' | 'mk' | 'en'): VerificationLogItem[] {
  if (lang === 'sr') {
    return [
      {
        id: '#7482',
        customer: 'Nikola Petrović',
        phone: '+381 64 123 ****',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Beograd',
        amount: '4.850 RSD',
        time: 'Pre 4 min',
        responseTime: '1.4 min',
        warehouseAction: 'Spremno za slanje · WooCommerce status "Processing"',
        history: [
          {
            time: '14:38:10',
            type: 'order',
            badge: 'WooCommerce #7482',
            title: 'Porudžbina kreirana (COD)',
            desc: 'Kupac je završio poručivanje pouzećem u prodavnici. Paket privremeno zadržan do verifikacije.'
          },
          {
            time: '14:38:15',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber verifikacija poslata',
            desc: 'Potvrdio automatski poslao interaktivnu poruku sa 1-klik dugmetom za potvrdu.'
          },
          {
            time: '14:39:10',
            type: 'read',
            badge: 'Viber Status: Seen',
            title: 'Poruka isporučena i pročitana',
            desc: 'Kupac je otvorio notifikaciju na mobilnom uređaju.'
          },
          {
            time: '14:39:48',
            type: 'action',
            badge: '1-Klik Potvrda',
            title: 'Porudžbina potvrđena od strane kupca',
            desc: 'Kupac je kliknuo "Potvrdi porudžbinu". WooCommerce nalog prebačen u "Processing" (Spremno za kurira).'
          }
        ]
      },
      {
        id: '#7481',
        customer: 'Milica Jovanović',
        phone: '+381 63 987 ****',
        status: 'EDITED_ADDRESS',
        channel: 'potvrdio.online',
        city: 'Novi Sad',
        amount: '8.200 RSD',
        time: 'Pre 18 min',
        responseTime: '4.2 min',
        updatedAddress: 'Bulevar Oslobođenja 42, Ulaz B, Stan 12, Novi Sad',
        warehouseAction: 'Adresa ažurirana u bazi · Kurirski nalog generisan sa tačnim stanom',
        history: [
          {
            time: '14:18:00',
            type: 'order',
            badge: 'WooCommerce #7481',
            title: 'Porudžbina kreirana (Nepotpuna adresa)',
            desc: 'Inicijalna adresa: "Bulevar Oslobođenja bb". Potvrdio algoritam detektovao nedostajući broj stana/ulaza.'
          },
          {
            time: '14:18:08',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber verifikacioni link poslat',
            desc: 'Poslata poruka sa potvrdio.online linkom za proveru i ispravku adrese za kurira.'
          },
          {
            time: '14:21:40',
            type: 'read',
            badge: 'potvrdio.online Portal',
            title: 'Kupac otvorio verifikacioni portal',
            desc: 'Kupac pristupio namenskom portalu za korekciju adrese i odabir lokacije na mapi.'
          },
          {
            time: '14:24:20',
            type: 'action',
            badge: 'Adresa Ispravljena',
            title: 'Kompletna adresa uneta i potvrđena',
            desc: 'Kupac dopunio: "Bulevar Oslobođenja 42, Ulaz B, Stan 12". WooCommerce podaci za dostavu automatski ažurirani bez poziva.'
          }
        ]
      },
      {
        id: '#7480',
        customer: 'Stefan Ilić',
        phone: '+381 61 456 ****',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Niš',
        amount: '3.100 RSD',
        time: 'Pre 42 min',
        responseTime: '2.1 min',
        warehouseAction: 'Autorizovano · Spakovano u magacinu',
        history: [
          {
            time: '13:58:00',
            type: 'order',
            badge: 'WooCommerce #7480',
            title: 'Porudžbina evidentirana',
            desc: 'Standardna COD porudžbina ubačena u red za verifikaciju.'
          },
          {
            time: '13:58:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber poruka isporučena',
            desc: 'Automatska notifikacija isporučena na telefon kupca.'
          },
          {
            time: '13:59:15',
            type: 'read',
            badge: 'Viber Status: Seen',
            title: 'Poruka pročitana',
            desc: 'Kupac je pogledao sažetak porudžbine i iznos za plaćanje kuriru.'
          },
          {
            time: '14:00:15',
            type: 'action',
            badge: '1-Klik Potvrda',
            title: 'Kupac potvrdio prijem paketa',
            desc: 'Potvrđeno bez izmena. Magacin obavešten da spakuje pošiljku.'
          }
        ]
      },
      {
        id: '#7479',
        customer: 'Jelena Stojanović',
        phone: '+387 65 321 ****',
        status: 'SMS_FALLBACK',
        channel: 'SMS Fallback',
        city: 'Banja Luka',
        amount: '6.400 RSD',
        time: 'Pre 1h 12m',
        responseTime: 'Čeka se odgovor (15m Viber timeout)',
        warehouseAction: 'Na čekanju · SMS verifikacioni link poslat na mobilni',
        history: [
          {
            time: '13:05:00',
            type: 'order',
            badge: 'WooCommerce #7479',
            title: 'Porudžbina kreirana na sajtu',
            desc: 'Kupac odabrao plaćanje pouzećem.'
          },
          {
            time: '13:05:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Pokušaj slanja Viber poruke',
            desc: 'Zahtev prosleđen Viber platformi na broj +387 65 321 ****.'
          },
          {
            time: '13:20:06',
            type: 'fallback',
            badge: 'TTL Istek (15 min)',
            title: 'Viber poruka nije pročitana / Nema Viber',
            desc: 'Kupac nema aktivnu Viber aplikaciju ili internet konekciju unutar zadatih 15 minuta.'
          },
          {
            time: '13:20:12',
            type: 'dispatch',
            badge: 'Regionalni SMS Gateway',
            title: 'SMS Fallback ruta aktivirana',
            desc: 'Automatski prebačeno na regionalni SMS gateway. Poslat SMS sa jedinstvenim verifikacionim tokenom.'
          },
          {
            time: '13:20:45',
            type: 'read',
            badge: 'SMS Isporučen',
            title: 'SMS isporučen na mobilnu mrežu',
            desc: 'Potvrda o prijemu SMS-a zabeležena. Čeka se akcija kupca pre slanja kurira.'
          }
        ]
      },
      {
        id: '#7478',
        customer: 'Marko Đorđević',
        phone: '+381 62 888 ****',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Kragujevac',
        amount: '5.900 RSD',
        time: 'Pre 2h 05m',
        responseTime: '1.8 min',
        warehouseAction: 'Predato kurirskoj službi (BEX Express)',
        history: [
          {
            time: '12:30:00',
            type: 'order',
            badge: 'WooCommerce #7478',
            title: 'Porudžbina kreirana',
            desc: 'Kreirana COD porudžbina u iznosu od 5.900 RSD.'
          },
          {
            time: '12:30:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber verifikacija isporučena',
            desc: 'Isporučena poruka sa brzim opcijama.'
          },
          {
            time: '12:32:10',
            type: 'action',
            badge: '1-Klik Potvrda',
            title: 'Kupac potvrdio porudžbinu',
            desc: 'Paket spakovan i uspešno prosleđen kuriru u Kragujevcu.'
          }
        ]
      },
      {
        id: '#7477',
        customer: 'Bojan Radovanović',
        phone: '+381 60 777 ****',
        status: 'CANCELLED',
        channel: 'Viber (1-klik)',
        city: 'Subotica',
        amount: '7.350 RSD',
        time: 'Pre 2h 45m',
        responseTime: '10.2 min',
        costSaved: '€5.50 (sprečeni troškovi povratne poštarine)',
        warehouseAction: 'Paket zaustavljen u magacinu · Nalog storniran',
        history: [
          {
            time: '11:45:00',
            type: 'order',
            badge: 'WooCommerce #7477',
            title: 'Porudžbina kreirana (COD)',
            desc: 'Kupac poručio 2 artikla pouzećem u vrednosti od 7.350 RSD.'
          },
          {
            time: '11:45:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber verifikacija isporučena',
            desc: 'Isporučena poruka sa brzim opcijama "Potvrdi" i "Otkaži".'
          },
          {
            time: '11:55:12',
            type: 'cancel',
            badge: '1-Klik Otkazano',
            title: 'Kupac otkazao porudžbinu',
            desc: 'Kupac kliknuo "Odustajem od kupovine". Naveden razlog: "Naručena pogrešna veličina".'
          },
          {
            time: '11:55:14',
            type: 'saved',
            badge: 'Sprečen Trošak',
            title: 'Zaustavljeno slanje · Sačuvana poštarina',
            desc: 'WooCommerce status automatski postavljen na "Cancelled". Paket nije napustio magacin — sprečeni troškovi povratne poštarine od ~€5.50.'
          }
        ]
      },
      {
        id: '#7476',
        customer: 'Tamara Simić',
        phone: '+381 65 554 ****',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Čačak',
        amount: '3.890 RSD',
        time: 'Pre 3h 10m',
        responseTime: '1.6 min',
        warehouseAction: 'Potvrđeno · Spakovano za otpremanje',
        history: [
          {
            time: '11:20:00',
            type: 'order',
            badge: 'WooCommerce #7476',
            title: 'Porudžbina kreirana',
            desc: 'Standardna COD narudžbina.'
          },
          {
            time: '11:20:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber poruka isporučena',
            desc: 'Automatska poruka isporučena na telefon kupca.'
          },
          {
            time: '11:21:45',
            type: 'action',
            badge: '1-Klik Potvrda',
            title: 'Porudžbina potvrđena',
            desc: 'Kupac kliknuo "Potvrdi". Paket prosleđen u magacin.'
          }
        ]
      },
      {
        id: '#7475',
        customer: 'Dragan Vasić',
        phone: '+381 69 443 ****',
        status: 'EDITED_ADDRESS',
        channel: 'potvrdio.online',
        city: 'Pančevo',
        amount: '12.400 RSD',
        time: 'Pre 4h 25m',
        responseTime: '13.3 min',
        updatedAddress: 'Svetog Save 18, Ulaz 2, Stan 9, Pančevo',
        warehouseAction: 'Adresa i sprat uneti · Sinhronizovano sa kurirskom službom',
        history: [
          {
            time: '10:05:00',
            type: 'order',
            badge: 'WooCommerce #7475',
            title: 'Porudžbina evidentirana',
            desc: 'Kupac izostavio broj ulaza i stana u porudžbini od 12.400 RSD.'
          },
          {
            time: '10:05:08',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber verifikacija sa linkom',
            desc: 'Poslata poruka sa potvrdio.online linkom.'
          },
          {
            time: '10:14:20',
            type: 'read',
            badge: 'potvrdio.online Portal',
            title: 'Kupac otvorio portal',
            desc: 'Kupac otvorio ekran za proveru lokacije i dodao detalje zgrade.'
          },
          {
            time: '10:18:30',
            type: 'action',
            badge: 'Adresa Ispravljena',
            title: 'Tačna adresa sačuvana',
            desc: 'Ažurirano: "Svetog Save 18, Ulaz 2, Stan 9". WooCommerce nalog ažuriran bez reklamacije.'
          }
        ]
      },
      {
        id: '#7474',
        customer: 'Anja Kovačević',
        phone: '+381 64 332 ****',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Kruševac',
        amount: '4.150 RSD',
        time: 'Pre 5h 50m',
        responseTime: '1.2 min',
        warehouseAction: 'Potvrđeno · Otpremljeno',
        history: [
          {
            time: '08:40:00',
            type: 'order',
            badge: 'WooCommerce #7474',
            title: 'Porudžbina kreirana',
            desc: 'COD porudžbina evidentirana.'
          },
          {
            time: '08:40:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber poruka isporučena',
            desc: 'Isporučena poruka sa 1-klik dugmetom.'
          },
          {
            time: '08:41:20',
            type: 'action',
            badge: '1-Klik Potvrda',
            title: 'Kupac potvrdio u roku od 1.2 min',
            desc: 'Spremno za slanje.'
          }
        ]
      },
      {
        id: '#7473',
        customer: 'Miloš Tešić',
        phone: '+381 63 221 ****',
        status: 'SMS_FALLBACK',
        channel: 'SMS Fallback',
        city: 'Zrenjanin',
        amount: '2.950 RSD',
        time: 'Pre 7h 15m',
        responseTime: 'Timeout (15m)',
        warehouseAction: 'SMS poslat · Na čekanju verifikacije',
        history: [
          {
            time: '07:15:00',
            type: 'order',
            badge: 'WooCommerce #7473',
            title: 'Porudžbina kreirana',
            desc: 'Kupac naručio uz pouzeće.'
          },
          {
            time: '07:15:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber pokušaj',
            desc: 'Viber poruka neisporučena (Kupac nema Viber).'
          },
          {
            time: '07:30:06',
            type: 'fallback',
            badge: 'TTL Istek',
            title: 'Prebačeno na SMS Fallback',
            desc: 'Aktiviran SMS gateway.'
          },
          {
            time: '07:31:00',
            type: 'read',
            badge: 'SMS Isporučen',
            title: 'SMS poslat kupcu',
            desc: 'Čeka se potvrda ili kontakt pre slanja paketa.'
          }
        ]
      },
      {
        id: '#7472',
        customer: 'Aleksandra Popović',
        phone: '+381 61 990 ****',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Šabac',
        amount: '6.800 RSD',
        time: 'Pre 9h 30m',
        responseTime: '2.4 min',
        warehouseAction: 'Potvrđeno · Isporučeno kurirskoj službi',
        history: [
          {
            time: '05:00:00',
            type: 'order',
            badge: 'WooCommerce #7472',
            title: 'Porudžbina kreirana',
            desc: 'Kreirana porudžbina.'
          },
          {
            time: '05:00:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber poruka isporučena',
            desc: 'Poslat upit za potvrdu.'
          },
          {
            time: '05:03:10',
            type: 'action',
            badge: '1-Klik Potvrda',
            title: 'Potvrđeno',
            desc: 'Paket otpremljen.'
          }
        ]
      },
      {
        id: '#7471',
        customer: 'Vladimir Lukić',
        phone: '+381 62 112 ****',
        status: 'CANCELLED',
        channel: 'Viber (1-klik)',
        city: 'Valjevo',
        amount: '5.400 RSD',
        time: 'Pre 11h',
        responseTime: '8.5 min',
        costSaved: '€5.50 (sprečen povrat)',
        warehouseAction: 'Stornirano pre slanja · Paket sačuvan u magacinu',
        history: [
          {
            time: '03:30:00',
            type: 'order',
            badge: 'WooCommerce #7471',
            title: 'Porudžbina kreirana',
            desc: 'Kupac naručio pouzećem u 03:30.'
          },
          {
            time: '03:30:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber verifikacija isporučena',
            desc: 'Poslata poruka.'
          },
          {
            time: '03:42:15',
            type: 'cancel',
            badge: '1-Klik Otkazano',
            title: 'Kupac kliknuo otkazivanje',
            desc: 'Kupac odustao od porudžbine pre nego što je paket poslat.'
          },
          {
            time: '03:42:16',
            type: 'saved',
            badge: 'Sačuvana Poštarina',
            title: 'Sprečen povratni kurirski trošak',
            desc: 'Nalog automatski storniran u prodavnici. Ušteđeno €5.50 troškova povratne pošiljke.'
          }
        ]
      }
    ];
  }

  if (lang === 'mk') {
    return [
      {
        id: '#7482',
        customer: 'Александар Николов',
        phone: '+389 70 123 ***',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Скопје',
        amount: '2.450 ден',
        time: 'Пред 4 мин',
        responseTime: '1.4 мин',
        warehouseAction: 'Подготвено за праќање · WooCommerce статус "Processing"',
        history: [
          {
            time: '14:38:10',
            type: 'order',
            badge: 'WooCommerce #7482',
            title: 'Нарачка евидентирана (COD)',
            desc: 'Купувачот го заврши COD checkout процесот. Пратката е задржана за верификација.'
          },
          {
            time: '14:38:15',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber верификација испратена',
            desc: 'Potvrdio автоматски испрати интерактивна порака со 1-клик копче за потврда.'
          },
          {
            time: '14:39:10',
            type: 'read',
            badge: 'Viber Status: Seen',
            title: 'Пораката е испорачана и прочитана',
            desc: 'Купувачот ја отвори нотификацијата на мобилниот уред.'
          },
          {
            time: '14:39:48',
            type: 'action',
            badge: '1-Клик Потврда',
            title: 'Нарачката е потврдена од купувачот',
            desc: 'Купувачот кликна "Потврди нарачка". Статусот во WooCommerce е променет во "Processing".'
          }
        ]
      },
      {
        id: '#7481',
        customer: 'Елена Стојановска',
        phone: '+389 71 987 ***',
        status: 'EDITED_ADDRESS',
        channel: 'potvrdio.online',
        city: 'Битола',
        amount: '4.100 ден',
        time: 'Пред 18 мин',
        responseTime: '4.2 мин',
        updatedAddress: 'Улица Партизанска 14, Влез 2, Стан 8, Битола',
        warehouseAction: 'Адресата е ажурирана · Курирскиот налог е генериран со точна локација',
        history: [
          {
            time: '14:18:00',
            type: 'order',
            badge: 'WooCommerce #7481',
            title: 'Нарачка евидентирана (Нецелосна адреса)',
            desc: 'Почетна адреса: "Партизанска бб". Системот детектираше недостасувачки број на стан/влез.'
          },
          {
            time: '14:18:08',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber верификациски линк испратен',
            desc: 'Испратена порака со potvrdio.online линк за проверка и корекција на адресата за курирот.'
          },
          {
            time: '14:21:40',
            type: 'read',
            badge: 'potvrdio.online Portal',
            title: 'Купувачот го отвори порталот',
            desc: 'Купувачот пристапи на специјалниот портал за корекција на адресата и избор на локација.'
          },
          {
            time: '14:24:20',
            type: 'action',
            badge: 'Адресата е Коригирана',
            title: 'Комплетната адреса е внесена и потврдена',
            desc: 'Ажурирано: "Партизанска 14, Влез 2, Стан 8". Податоците во WooCommerce се ажурирани автоматски.'
          }
        ]
      },
      {
        id: '#7480',
        customer: 'Стефан Трајков',
        phone: '+389 75 456 ***',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Охрид',
        amount: '1.850 ден',
        time: 'Пред 42 мин',
        responseTime: '2.1 мин',
        warehouseAction: 'Авторизирано · Спакувано во магацин',
        history: [
          {
            time: '13:58:00',
            type: 'order',
            badge: 'WooCommerce #7480',
            title: 'Нарачка евидентирана',
            desc: 'Стандардна COD нарачка во ред за верификација.'
          },
          {
            time: '13:58:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber порака испорачана',
            desc: 'Автоматска нотификација испратена на телефон.'
          },
          {
            time: '13:59:15',
            type: 'read',
            badge: 'Viber Status: Seen',
            title: 'Пораката е прочитана',
            desc: 'Купувачот го прегледа износот за плаќање при прием.'
          },
          {
            time: '14:00:15',
            type: 'action',
            badge: '1-Клик Потврда',
            title: 'Потврдено без измени',
            desc: 'Магацинот е известен да ја спакува пратката.'
          }
        ]
      },
      {
        id: '#7479',
        customer: 'Марија Димитриевска',
        phone: '+389 78 321 ***',
        status: 'SMS_FALLBACK',
        channel: 'SMS Fallback',
        city: 'Куманово',
        amount: '3.200 ден',
        time: 'Пред 1ч 12м',
        responseTime: 'Се чека одговор (15м Viber тајмаут)',
        warehouseAction: 'На чекање · SMS верификациски линк е испратен',
        history: [
          {
            time: '13:05:00',
            type: 'order',
            badge: 'WooCommerce #7479',
            title: 'Нарачка креирана на веб-сајтот',
            desc: 'Купувачот избра плаќање при достава.'
          },
          {
            time: '13:05:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Обид за испраќање на Viber',
            desc: 'Барањето е проследено до Viber платформата.'
          },
          {
            time: '13:20:06',
            type: 'fallback',
            badge: 'TTL Истек (15 мин)',
            title: 'Viber пораката не е прочитана',
            desc: 'Купувачот нема Viber апликација или интернет врска во зададените 15 минути.'
          },
          {
            time: '13:20:12',
            type: 'dispatch',
            badge: 'Регионален SMS Gateway',
            title: 'SMS Алтернатива активирана',
            desc: 'Автоматски префрлено на SMS gateway со безбеден линк.'
          },
          {
            time: '13:20:45',
            type: 'read',
            badge: 'SMS Испорачан',
            title: 'SMS испорачан на мобилната мрежа',
            desc: 'Се чека реакција на купувачот пред испраќање.'
          }
        ]
      },
      {
        id: '#7478',
        customer: 'Горан Ристов',
        phone: '+389 72 888 ***',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Прилеп',
        amount: '2.900 ден',
        time: 'Пред 2ч 05м',
        responseTime: '1.8 мин',
        warehouseAction: 'Предадено на курирска служба',
        history: [
          {
            time: '12:30:00',
            type: 'order',
            badge: 'WooCommerce #7478',
            title: 'Нарачка креирана',
            desc: 'Креирана COD нарачка во износ од 2.900 ден.'
          },
          {
            time: '12:30:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber порака испорачана',
            desc: 'Испорачана нотификација.'
          },
          {
            time: '12:32:10',
            type: 'action',
            badge: '1-Клик Потврда',
            title: 'Купувачот ја потврди пратката',
            desc: 'Пратката е спакувана и испратена.'
          }
        ]
      },
      {
        id: '#7477',
        customer: 'Бојан Костовски',
        phone: '+389 70 554 ***',
        status: 'CANCELLED',
        channel: 'Viber (1-клик)',
        city: 'Тетово',
        amount: '3.650 ден',
        time: 'Пред 2ч 45м',
        responseTime: '10.2 мин',
        costSaved: '€5.50 (спречени трошоци за поштарина)',
        warehouseAction: 'Пратката е сопрена во магацин · Сторнирано',
        history: [
          {
            time: '11:45:00',
            type: 'order',
            badge: 'WooCommerce #7477',
            title: 'Нарачка креирана',
            desc: 'Купувачот нарача производи во вредност од 3.650 ден.'
          },
          {
            time: '11:45:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber верификација испорачана',
            desc: 'Испратена порака со опции "Потврди" и "Откажи".'
          },
          {
            time: '11:55:12',
            type: 'cancel',
            badge: '1-Клик Откажано',
            title: 'Купувачот ја откажа нарачката',
            desc: 'Купувачот кликна "Се откажувам од купувањето". Причина: погрешна големина.'
          },
          {
            time: '11:55:14',
            type: 'saved',
            badge: 'Спречен Трошок',
            title: 'Сопрено испраќање · Заштедена поштарина',
            desc: 'Статусот во WooCommerce е променет во "Cancelled". Пратката не го напушти магацинот — заштедени €5.50 трошоци за враќање.'
          }
        ]
      },
      {
        id: '#7476',
        customer: 'Тамара Илиевска',
        phone: '+389 76 776 ***',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Струмица',
        amount: '1.990 ден',
        time: 'Пред 3ч 10м',
        responseTime: '1.6 мин',
        warehouseAction: 'Потврдено · Спакувано за испраќање',
        history: [
          {
            time: '11:20:00',
            type: 'order',
            badge: 'WooCommerce #7476',
            title: 'Нарачка креирана',
            desc: 'Стандардна нарачка со плаќање при достава.'
          },
          {
            time: '11:20:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber порака испорачана',
            desc: 'Автоматска порака испратена.'
          },
          {
            time: '11:21:45',
            type: 'action',
            badge: '1-Клик Потврда',
            title: 'Нарачката е потврдена',
            desc: 'Купувачот потврди за 1.6 минути.'
          }
        ]
      },
      {
        id: '#7475',
        customer: 'Драган Спасов',
        phone: '+389 71 443 ***',
        status: 'EDITED_ADDRESS',
        channel: 'potvrdio.online',
        city: 'Велес',
        amount: '6.200 ден',
        time: 'Пред 4ч 25м',
        responseTime: '13.3 мин',
        updatedAddress: 'Улица 8 Септември 24, Стан 5, Велес',
        warehouseAction: 'Адресата е коригирана · Налогот е ажуриран',
        history: [
          {
            time: '10:05:00',
            type: 'order',
            badge: 'WooCommerce #7475',
            title: 'Нарачка евидентирана',
            desc: 'Недостасуваше број на стан во нарачката.'
          },
          {
            time: '10:05:08',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber линк испратен',
            desc: 'Испратена порака за проверка на адресата.'
          },
          {
            time: '10:14:20',
            type: 'read',
            badge: 'potvrdio.online Portal',
            title: 'Купувачот го отвори порталот',
            desc: 'Купувачот ги додаде точните податоци за зградата.'
          },
          {
            time: '10:18:30',
            type: 'action',
            badge: 'Адресата е Ажурирана',
            title: 'Точната адреса е зачувана',
            desc: 'Ажурирано во WooCommerce без потреба од телефонски повик.'
          }
        ]
      },
      {
        id: '#7474',
        customer: 'Ања Георгиева',
        phone: '+389 75 332 ***',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Штип',
        amount: '2.150 ден',
        time: 'Пред 5ч 50м',
        responseTime: '1.2 мин',
        warehouseAction: 'Потврдено · Испратено',
        history: [
          {
            time: '08:40:00',
            type: 'order',
            badge: 'WooCommerce #7474',
            title: 'Нарачка креирана',
            desc: 'COD нарачка евидентирана.'
          },
          {
            time: '08:40:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber порака испорачана',
            desc: 'Испратена нотификација.'
          },
          {
            time: '08:41:20',
            type: 'action',
            badge: '1-Клик Потврда',
            title: 'Купувачот потврди за 1.2 мин',
            desc: 'Пратката е подготвена.'
          }
        ]
      },
      {
        id: '#7473',
        customer: 'Милош Ангелов',
        phone: '+389 78 221 ***',
        status: 'SMS_FALLBACK',
        channel: 'SMS Fallback',
        city: 'Гостивар',
        amount: '1.450 ден',
        time: 'Пред 7ч 15м',
        responseTime: 'Timeout (15м)',
        warehouseAction: 'SMS испратен · Се чека потврда',
        history: [
          {
            time: '07:15:00',
            type: 'order',
            badge: 'WooCommerce #7473',
            title: 'Нарачка креирана',
            desc: 'Нарачано со плаќање при прием.'
          },
          {
            time: '07:15:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber обид',
            desc: 'Нема Viber апликација на бројот.'
          },
          {
            time: '07:30:06',
            type: 'fallback',
            badge: 'TTL Истек',
            title: 'Префрлено на SMS Fallback',
            desc: 'Активиран SMS gateway со верификациски линк.'
          },
          {
            time: '07:31:00',
            type: 'read',
            badge: 'SMS Испорачан',
            title: 'SMS испратен до купувачот',
            desc: 'Се чека потврда пред испраќање.'
          }
        ]
      },
      {
        id: '#7472',
        customer: 'Александра Петрова',
        phone: '+389 72 990 ***',
        status: 'APPROVED',
        channel: 'Viber',
        city: 'Кавадарци',
        amount: '3.400 ден',
        time: 'Пред 9ч 30м',
        responseTime: '2.4 мин',
        warehouseAction: 'Потврдено · Предадено на курир',
        history: [
          {
            time: '05:00:00',
            type: 'order',
            badge: 'WooCommerce #7472',
            title: 'Нарачка креирана',
            desc: 'Креирана нарачка.'
          },
          {
            time: '05:00:05',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber порака испорачана',
            desc: 'Испратено барање за потврда.'
          },
          {
            time: '05:03:10',
            type: 'action',
            badge: '1-Клик Потврда',
            title: 'Потврдено',
            desc: 'Пратката е испратена.'
          }
        ]
      },
      {
        id: '#7471',
        customer: 'Владимир Иванов',
        phone: '+389 70 112 ***',
        status: 'CANCELLED',
        channel: 'Viber (1-клик)',
        city: 'Кочани',
        amount: '2.700 ден',
        time: 'Пред 11ч',
        responseTime: '8.5 мин',
        costSaved: '€5.50 (спречен поврат)',
        warehouseAction: 'Сторнирано пред праќање · Пратката е задржана',
        history: [
          {
            time: '03:30:00',
            type: 'order',
            badge: 'WooCommerce #7471',
            title: 'Нарачка креирана',
            desc: 'Креирана нарачка во 03:30.'
          },
          {
            time: '03:30:06',
            type: 'dispatch',
            badge: 'Viber Business API',
            title: 'Viber верификација испорачана',
            desc: 'Испратена порака.'
          },
          {
            time: '03:42:15',
            type: 'cancel',
            badge: '1-Клик Откажано',
            title: 'Купувачот кликна откажување',
            desc: 'Купувачот се откажа од нарачката навреме.'
          },
          {
            time: '03:42:16',
            type: 'saved',
            badge: 'Заштедена Поштарина',
            title: 'Спречен трошок за поврат',
            desc: 'Нарачката е автоматски сторнирана во продавницата. Заштедени се €5.50.'
          }
        ]
      }
    ];
  }

  // Default to English ('en')
  return [
    {
      id: '#7482',
      customer: 'Nikola Petrovic',
      phone: '+381 64 123 ****',
      status: 'APPROVED',
      channel: 'Viber',
      city: 'Belgrade',
      amount: '€42.00',
      time: '4 mins ago',
      responseTime: '1.4 mins',
      warehouseAction: 'Ready for Dispatch · WooCommerce status "Processing"',
      history: [
        {
          time: '14:38:10',
          type: 'order',
          badge: 'WooCommerce #7482',
          title: 'Order Placed via COD Checkout',
          desc: 'Buyer completed online checkout with Cash on Delivery. Order put on hold for automated verification.'
        },
        {
          time: '14:38:15',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Verification Dispatched',
          desc: 'Potvrdio gateway sent an interactive message with a 1-click confirmation button.'
        },
        {
          time: '14:39:10',
          type: 'read',
          badge: 'Viber Status: Seen',
          title: 'Message Delivered & Opened',
          desc: 'Buyer opened the Viber notification on their mobile phone.'
        },
        {
          time: '14:39:48',
          type: 'action',
          badge: '1-Click Confirmation',
          title: 'Order Approved by Customer',
          desc: 'Buyer clicked "Confirm Order". WooCommerce status updated to "Processing" for warehouse dispatch.'
        }
      ]
    },
    {
      id: '#7481',
      customer: 'Elena Stojanovska',
      phone: '+389 71 987 ****',
      status: 'EDITED_ADDRESS',
      channel: 'potvrdio.online',
      city: 'Skopje',
      amount: '€70.00',
      time: '18 mins ago',
      responseTime: '4.2 mins',
      updatedAddress: 'Partizanski Odredi 42, Apt 12, Skopje',
      warehouseAction: 'Address updated in WooCommerce · Accurate courier shipping label generated',
      history: [
        {
          time: '14:18:00',
          type: 'order',
          badge: 'WooCommerce #7481',
          title: 'Order Placed (Incomplete Address)',
          desc: 'Initial address had only street name without apartment/entrance. Potvrdio algorithm flagged missing details.'
        },
        {
          time: '14:18:08',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Verification Link Sent',
          desc: 'Dispatched message with secure potvrdio.online link to verify and update delivery address.'
        },
        {
          time: '14:21:40',
          type: 'read',
          badge: 'potvrdio.online Portal',
          title: 'Buyer Opened Verification Portal',
          desc: 'Customer accessed the mobile address correction portal with pin-on-map selection.'
        },
        {
          time: '14:24:20',
          type: 'action',
          badge: 'Address Updated',
          title: 'Complete Address Submitted & Verified',
          desc: 'Buyer completed: "Partizanski Odredi 42, Apt 12". WooCommerce shipping details updated automatically.'
        }
      ]
    },
    {
      id: '#7480',
      customer: 'Stefan Ilic',
      phone: '+381 61 456 ****',
      status: 'APPROVED',
      channel: 'Viber',
      city: 'Novi Sad',
      amount: '€26.50',
      time: '42 mins ago',
      responseTime: '2.1 mins',
      warehouseAction: 'Authorized · Packaged in warehouse',
      history: [
        {
          time: '13:58:00',
          type: 'order',
          badge: 'WooCommerce #7480',
          title: 'Order Placed via COD',
          desc: 'Standard cash-on-delivery order placed in online store.'
        },
        {
          time: '13:58:05',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Message Dispatched',
          desc: 'Automated notification sent to customer phone.'
        },
        {
          time: '13:59:15',
          type: 'read',
          badge: 'Viber Status: Seen',
          title: 'Message Read by Buyer',
          desc: 'Customer reviewed order breakdown and COD amount.'
        },
        {
          time: '14:00:15',
          type: 'action',
          badge: '1-Click Confirmation',
          title: 'Order Confirmed without Changes',
          desc: 'Warehouse notified to pack and ship parcel.'
        }
      ]
    },
    {
      id: '#7479',
      customer: 'Marija Dimitrievska',
      phone: '+389 78 321 ****',
      status: 'SMS_FALLBACK',
      channel: 'SMS Fallback',
      city: 'Bitola',
      amount: '€54.00',
      time: '1h 12m ago',
      responseTime: 'Awaiting Response (15m Viber timeout)',
      warehouseAction: 'On Hold · SMS verification link dispatched to phone',
      history: [
        {
          time: '13:05:00',
          type: 'order',
          badge: 'WooCommerce #7479',
          title: 'Order Placed via Online Store',
          desc: 'Customer chose cash on delivery at checkout.'
        },
        {
          time: '13:05:06',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Dispatch Attempted',
          desc: 'Request routed to Viber API for recipient.'
        },
        {
          time: '13:20:06',
          type: 'fallback',
          badge: 'TTL Expired (15 min)',
          title: 'Viber Message Unread / No Viber App',
          desc: 'Customer has no active Viber or connection within 15 minute timeout.'
        },
        {
          time: '13:20:12',
          type: 'dispatch',
          badge: 'Regional SMS Gateway',
          title: 'SMS Fallback Route Activated',
          desc: 'Automatically routed to regional telco SMS gateway with single-use verification token.'
        },
        {
          time: '13:20:45',
          type: 'read',
          badge: 'SMS Delivered',
          title: 'SMS Delivered to Mobile Network',
          desc: 'Delivery receipt recorded. Awaiting customer confirmation before dispatch.'
        }
      ]
    },
    {
      id: '#7478',
      customer: 'Goran Ristov',
      phone: '+381 62 888 ****',
      status: 'APPROVED',
      channel: 'Viber',
      city: 'Sarajevo',
      amount: '€49.00',
      time: '2h 05m ago',
      responseTime: '1.8 mins',
      warehouseAction: 'Handed over to carrier for delivery',
      history: [
        {
          time: '12:30:00',
          type: 'order',
          badge: 'WooCommerce #7478',
          title: 'Order Placed',
          desc: 'Created COD order for €49.00.'
        },
        {
          time: '12:30:05',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Verification Sent',
          desc: 'Delivered message with quick response buttons.'
        },
        {
          time: '12:32:10',
          type: 'action',
          badge: '1-Click Confirmation',
          title: 'Customer Approved Delivery',
          desc: 'Parcel packed and handed over to courier.'
        }
      ]
    },
    {
      id: '#7477',
      customer: 'Bojan Kostovski',
      phone: '+389 70 554 ****',
      status: 'CANCELLED',
      channel: 'Viber (1-click)',
      city: 'Tetovo',
      amount: '€31.00',
      time: '2h 45m ago',
      responseTime: '10.2 mins',
      costSaved: '€5.50 (prevented two-way courier return fee)',
      warehouseAction: 'Order Cancelled Before Shipping · Zero return loss',
      history: [
        {
          time: '11:45:00',
          type: 'order',
          badge: 'WooCommerce #7477',
          title: 'Order Placed (COD)',
          desc: 'Customer placed order for 2 items.'
        },
        {
          time: '11:45:06',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Verification Dispatched',
          desc: 'Message delivered with "Confirm" and "Cancel" buttons.'
        },
        {
          time: '11:55:12',
          type: 'cancel',
          badge: '1-Click Cancellation',
          title: 'Buyer Cancelled Order',
          desc: 'Customer clicked "Cancel Order (Changed Mind)". Reason: wrong item size ordered.'
        },
        {
          time: '11:55:14',
          type: 'saved',
          badge: 'Saved Courier Fee',
          title: 'Shipment Halted · Return Fee Prevented',
          desc: 'WooCommerce status auto-switched to "Cancelled". Parcel stayed in warehouse — saved ~€5.50 in return courier penalties.'
        }
      ]
    },
    {
      id: '#7476',
      customer: 'Tamara Simic',
      phone: '+381 65 554 ****',
      status: 'APPROVED',
      channel: 'Viber',
      city: 'Nis',
      amount: '€33.00',
      time: '3h 10m ago',
      responseTime: '1.6 mins',
      warehouseAction: 'Confirmed · Packaged for transit',
      history: [
        {
          time: '11:20:00',
          type: 'order',
          badge: 'WooCommerce #7476',
          title: 'Order Placed',
          desc: 'Standard COD order placed.'
        },
        {
          time: '11:20:05',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Message Delivered',
          desc: 'Notification sent to buyer.'
        },
        {
          time: '11:21:45',
          type: 'action',
          badge: '1-Click Confirmation',
          title: 'Order Approved in 1.6 mins',
          desc: 'Customer approved, parcel dispatched to packaging.'
        }
      ]
    },
    {
      id: '#7475',
      customer: 'Dragan Vasic',
      phone: '+381 69 443 ****',
      status: 'EDITED_ADDRESS',
      channel: 'potvrdio.online',
      city: 'Banja Luka',
      amount: '€105.00',
      time: '4h 25m ago',
      responseTime: '13.3 mins',
      updatedAddress: 'Svetog Save 18, Apt 9, Banja Luka',
      warehouseAction: 'Apartment & entrance details added · Synced with courier',
      history: [
        {
          time: '10:05:00',
          type: 'order',
          badge: 'WooCommerce #7475',
          title: 'Order Placed',
          desc: 'Customer placed €105.00 order without apartment number.'
        },
        {
          time: '10:05:08',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Link Sent',
          desc: 'Sent potvrdio.online verification link.'
        },
        {
          time: '10:14:20',
          type: 'read',
          badge: 'potvrdio.online Portal',
          title: 'Buyer Opened Portal',
          desc: 'Buyer opened address check and added building details.'
        },
        {
          time: '10:18:30',
          type: 'action',
          badge: 'Address Updated',
          title: 'Exact Delivery Details Saved',
          desc: 'Updated: "Svetog Save 18, Apt 9". Saved without phone calls.'
        }
      ]
    },
    {
      id: '#7474',
      customer: 'Anja Kovacevic',
      phone: '+381 64 332 ****',
      status: 'APPROVED',
      channel: 'Viber',
      city: 'Kragujevac',
      amount: '€35.00',
      time: '5h 50m ago',
      responseTime: '1.2 mins',
      warehouseAction: 'Confirmed · Ready for pickup',
      history: [
        {
          time: '08:40:00',
          type: 'order',
          badge: 'WooCommerce #7474',
          title: 'Order Placed',
          desc: 'COD order placed.'
        },
        {
          time: '08:40:05',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Message Dispatched',
          desc: 'Delivered message with 1-click button.'
        },
        {
          time: '08:41:20',
          type: 'action',
          badge: '1-Click Confirmation',
          title: 'Confirmed by Customer in 1.2 min',
          desc: 'Parcel ready for carrier.'
        }
      ]
    },
    {
      id: '#7473',
      customer: 'Milos Tesic',
      phone: '+381 63 221 ****',
      status: 'SMS_FALLBACK',
      channel: 'SMS Fallback',
      city: 'Podgorica',
      amount: '€25.00',
      time: '7h 15m ago',
      responseTime: 'Timeout (15m)',
      warehouseAction: 'SMS Dispatched · Pending customer interaction',
      history: [
        {
          time: '07:15:00',
          type: 'order',
          badge: 'WooCommerce #7473',
          title: 'Order Placed',
          desc: 'COD order placed.'
        },
        {
          time: '07:15:06',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Attempt',
          desc: 'Viber undelivered (User has no Viber app).'
        },
        {
          time: '07:30:06',
          type: 'fallback',
          badge: 'TTL Expired',
          title: 'Switched to SMS Fallback',
          desc: 'Telco SMS route activated with verification link.'
        },
        {
          time: '07:31:00',
          type: 'read',
          badge: 'SMS Delivered',
          title: 'SMS Sent to Buyer Phone',
          desc: 'Awaiting confirmation before parcel dispatch.'
        }
      ]
    },
    {
      id: '#7472',
      customer: 'Aleksandra Popovic',
      phone: '+381 61 990 ****',
      status: 'APPROVED',
      channel: 'Viber',
      city: 'Subotica',
      amount: '€58.00',
      time: '9h 30m ago',
      responseTime: '2.4 mins',
      warehouseAction: 'Confirmed · Delivered to courier',
      history: [
        {
          time: '05:00:00',
          type: 'order',
          badge: 'WooCommerce #7472',
          title: 'Order Placed',
          desc: 'Order created.'
        },
        {
          time: '05:00:05',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Message Delivered',
          desc: 'Sent verification prompt.'
        },
        {
          time: '05:03:10',
          type: 'action',
          badge: '1-Click Confirmation',
          title: 'Confirmed',
          desc: 'Parcel dispatched.'
        }
      ]
    },
    {
      id: '#7471',
      customer: 'Vladimir Lukic',
      phone: '+381 62 112 ****',
      status: 'CANCELLED',
      channel: 'Viber (1-click)',
      city: 'Ohrid',
      amount: '€46.00',
      time: '11h ago',
      responseTime: '8.5 mins',
      costSaved: '€5.50 (prevented return fee)',
      warehouseAction: 'Cancelled in WooCommerce · Parcel kept in stock',
      history: [
        {
          time: '03:30:00',
          type: 'order',
          badge: 'WooCommerce #7471',
          title: 'Order Placed',
          desc: 'Order created at 03:30.'
        },
        {
          time: '03:30:06',
          type: 'dispatch',
          badge: 'Viber Business API',
          title: 'Viber Verification Delivered',
          desc: 'Message sent.'
        },
        {
          time: '03:42:15',
          type: 'cancel',
          badge: '1-Click Cancellation',
          title: 'Customer Clicked Cancel',
          desc: 'Customer cancelled before parcel was dispatched.'
        },
        {
          time: '03:42:16',
          type: 'saved',
          badge: 'Courier Fee Saved',
          title: 'Prevented Two-Way Return Costs',
          desc: 'Order automatically cancelled in store. Saved €5.50.'
        }
      ]
    }
  ];
}
