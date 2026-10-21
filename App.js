import React, { useState, createContext, useContext } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, Image, Pressable, Linking, StatusBar, StyleSheet,
  FlatList, Modal, useWindowDimensions, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#FFFFFF', ink: '#14213D', mute: '#6B7280', line: '#ECEDF0', soft: '#FFF8EB',
  amber: '#F59E0B', orange: '#F97316',
};

const DATA = {
  updated: '18 мая 2026',
  diesel: [
    ['Атырау', 'нефтебаза', '285 ₸/л'],
    ['Актобе', 'нефтебаза', '290 ₸/л'],
    ['Шымкент', 'нефтебаза', '303 ₸/л'],
  ],
  other: [
    ['Авиатопливо Jet A-1', 'по запросу'],
    ['Бензин АИ-92', '225 ₸/л'],
    ['Бензин АИ-95', '235 ₸/л'],
  ],
  news: [
    { t: 'Первая железнодорожная поставка Jet A-1 из КНР', d: '29.07.2026', img: 'https://mercuryenergy.kz/upload/iblock/DDR.jpeg',
      x: 'Sterling Energy организует поставку авиатоплива Jet A-1 из Китая в Казахстан совместно с PetroChina International и терминалом Dostyk Refinery.' },
    { t: 'Лаборатория получила свидетельство № 20/26', d: '16.06.2026', img: 'https://mercuryenergy.kz/RU.jpeg',
      x: 'Лаборатория Mercury Energy вправе отбирать пробы и контролировать качество авиатоплива ТС-1, РТ и Jet A-1.' },
    { t: 'Впервые в Казахстане заправили самолёт Jet A-1', d: '24.05.2026', img: 'https://mercuryenergy.kz/upload/iblock/d7a/Jet%20A-1.jpeg',
      x: 'Заправка прошла в аэропорту Туркестана. Топливо поставлено напрямую с завода PetroChina Dushanzi.' },
  ],
  facts: [
    ['19 000 м³', 'f1'],
    ['13', 'f2'],
    ['2018', 'f3'],
    ['JIG 2', 'f4'],
  ],
  team: [
    ['Ахметжанов Максат', 'Генеральный директор'],
    ['Тажибаев Талгат', 'Главный инженер'],
    ['Шашкова Вера', 'Начальник лаборатории'],
  ],
};

const open = (u) => Linking.openURL(u);

const I18N = {
  ru: { slogan: 'От бескрайних степей к вечному небу', intro: 'Mercury Energy — один из ведущих поставщиков авиационного топлива в Казахстане.',
    prices: 'Цены', call: 'Позвонить', news: 'Новости', close: 'Закрыть', tabHome: 'Главная', tabPrices: 'Цены', tabAbout: 'О нас', tabContacts: 'Контакты', tabRequest: 'Заявка',
    f1: 'объём хранения', f2: 'резервуаров', f3: 'год ввода', f4: 'стандарт качества',
    pricesT: 'Цены на топливо', asof: 'Актуально на', diesel: 'Дизельное топливо летнее', other: 'Авиатопливо и бензин', depot: 'нефтебаза',
    aboutT: 'О компании', depotT: 'Нефтебаза в Алматы', team: 'Руководство', contactsT: 'Контакты', map: 'Открыть на карте', site: 'Сайт компании',
    reqT: 'Заявка на поставку', reqP: 'Оставьте данные, и мы свяжемся с вами.', fName: 'Имя', fPhone: 'Телефон', fFuel: 'Вид топлива', fVol: 'Объём (литры или тонны)', fNote: 'Комментарий',
    send: 'Отправить заявку', fill: 'Укажите имя и телефон', subject: 'Заявка из приложения' },
  kk: { slogan: 'Кең даладан мәңгілік аспанға дейін', intro: 'Mercury Energy — Қазақстандағы авиациялық отынның жетекші жеткізушілерінің бірі.',
    prices: 'Бағалар', call: 'Қоңырау шалу', news: 'Жаңалықтар', close: 'Жабу', tabHome: 'Басты бет', tabPrices: 'Бағалар', tabAbout: 'Біз туралы', tabContacts: 'Байланыс', tabRequest: 'Өтінім',
    f1: 'сақтау көлемі', f2: 'резервуар', f3: 'іске қосылған жыл', f4: 'сапа стандарты',
    pricesT: 'Отын бағалары', asof: 'Өзектілігі:', diesel: 'Жазғы дизель отыны', other: 'Авиаотын және бензин', depot: 'мұнай базасы',
    aboutT: 'Компания туралы', depotT: 'Алматыдағы мұнай базасы', team: 'Басшылық', contactsT: 'Байланыс', map: 'Картадан ашу', site: 'Компания сайты',
    reqT: 'Жеткізуге өтінім', reqP: 'Деректеріңізді қалдырыңыз, біз сізбен байланысамыз.', fName: 'Аты-жөні', fPhone: 'Телефон', fFuel: 'Отын түрі', fVol: 'Көлемі (литр немесе тонна)', fNote: 'Түсініктеме',
    send: 'Өтінімді жіберу', fill: 'Аты-жөніңізді және телефоныңызды көрсетіңіз', subject: 'Қолданбадан өтінім' },
  en: { slogan: 'From the endless steppe to the eternal sky', intro: 'Mercury Energy is one of the leading aviation fuel suppliers in Kazakhstan.',
    prices: 'Prices', call: 'Call', news: 'News', close: 'Close', tabHome: 'Home', tabPrices: 'Prices', tabAbout: 'About', tabContacts: 'Contacts', tabRequest: 'Request',
    f1: 'storage volume', f2: 'tanks', f3: 'year opened', f4: 'quality standard',
    pricesT: 'Fuel prices', asof: 'As of', diesel: 'Summer diesel', other: 'Aviation fuel and petrol', depot: 'fuel depot',
    aboutT: 'About the company', depotT: 'Almaty fuel depot', team: 'Management', contactsT: 'Contacts', map: 'Open on map', site: 'Company website',
    reqT: 'Supply request', reqP: 'Leave your details and we will contact you.', fName: 'Name', fPhone: 'Phone', fFuel: 'Fuel type', fVol: 'Volume (liters or tons)', fNote: 'Comment',
    send: 'Send request', fill: 'Enter your name and phone', subject: 'Request from the app' },
};
const Lang = createContext('ru');
const useT = () => { const l = useContext(Lang); return (k) => I18N[l][k] || I18N.ru[k] || k; };


function Btn({ icon, label, onPress, ghost }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.btn, ghost && s.btnGhost, pressed && { opacity: 0.85 }]}>
      <Ionicons name={icon} size={18} color={ghost ? C.orange : '#fff'} />
      <Text style={[s.btnText, ghost && { color: C.orange }]}>{label}</Text>
    </Pressable>
  );
}

function Home({ go }) {
  const t = useT();
  const [sel, setSel] = useState(null);
  const { width } = useWindowDimensions();
  const cardW = Math.round(width * 0.7);
  const gap = 12;
  return (
    <>
      <Text style={s.h1}>{t('slogan')}</Text>
      <Text style={s.p}>{t('intro')}</Text>
      <View style={s.row}>
        <View style={{ flex: 1 }}><Btn icon="pricetag" label={t('prices')} onPress={() => go('prices')} /></View>
        <View style={{ flex: 1 }}><Btn icon="call" label={t('call')} onPress={() => open('tel:+77273132596')} ghost /></View>
      </View>

      <View style={s.facts}>
        {DATA.facts.map(([a, b]) => (
          <View key={b} style={s.fact}>
            <Text style={s.factN}>{a}</Text>
            <Text style={s.factL}>{t(b)}</Text>
          </View>
        ))}
      </View>

      <Text style={s.h2}>{t('news')}</Text>
      <FlatList
        horizontal
        data={DATA.news}
        keyExtractor={(n) => n.t}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + gap}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap }}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSel(item)} style={[s.news, { width: cardW }]}>
            <Image source={{ uri: item.img }} style={s.newsImg} resizeMode="cover" />
            <View style={{ padding: 14 }}>
              <Text style={s.date}>{item.d}</Text>
              <Text style={s.newsT} numberOfLines={3}>{item.t}</Text>
            </View>
          </Pressable>
        )}
      />
      <Modal visible={!!sel} animationType="slide" transparent onRequestClose={() => setSel(null)}>
        <Pressable style={s.overlay} onPress={() => setSel(null)}>
          <Pressable style={s.sheet}>
            {sel && (
              <>
                <Image source={{ uri: sel.img }} style={s.sheetImg} resizeMode="cover" />
                <Text style={[s.date, { marginTop: 14 }]}>{sel.d}</Text>
                <Text style={s.h2}>{sel.t}</Text>
                <Text style={s.p}>{sel.x}</Text>
                <View style={{ marginTop: 18 }}><Btn icon="close" label={t('close')} onPress={() => setSel(null)} /></View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function Prices() {
  const t = useT();
  return (
    <>
      <Text style={s.h1}>{t('pricesT')}</Text>
      <Text style={s.p}>{t('asof')} {DATA.updated}</Text>
      <Text style={s.h2}>{t('diesel')}</Text>
      {DATA.diesel.map(([c, k, p]) => (
        <View key={c} style={s.priceRow}>
          <View><Text style={s.priceName}>{c}</Text><Text style={s.mute}>{t('depot')}</Text></View>
          <Text style={s.price}>{p}</Text>
        </View>
      ))}
      <Text style={s.h2}>{t('other')}</Text>
      {DATA.other.map(([n, p]) => (
        <View key={n} style={s.priceRow}>
          <Text style={s.priceName}>{n}</Text>
          <Text style={s.price}>{p}</Text>
        </View>
      ))}
    </>
  );
}

function About() {
  const t = useT();
  return (
    <>
      <Text style={s.h1}>{t('aboutT')}</Text>
      <Text style={s.p}>
        Мы обеспечиваем бесперебойные поставки качественного авиатоплива в крупнейшие аэропорты страны. Круглосуточная диспетчерская следит за процессами в реальном времени, собственная лаборатория проверяет каждую партию, а автоматическая система пожаротушения Siemens обеспечивает безопасность.
      </Text>
      <Text style={s.h2}>{t('depotT')}</Text>
      <Text style={s.p}>
        Склад класса «А» принимает, хранит и выдаёт светлые нефтепродукты. Резервуарный парк: 13 РВС, ж/д эстакада на 6 постов. От вокзала «Алматы-1» — 3 км, от аэропорта — 6 км.
      </Text>
      <Text style={s.h2}>{t('team')}</Text>
      {DATA.team.map(([n, r]) => (
        <View key={n} style={s.priceRow}>
          <Text style={s.priceName}>{n}</Text>
          <Text style={s.mute}>{r}</Text>
        </View>
      ))}
      <Text style={s.h2}>Smart АЗС ION</Text>
      <Text style={s.p}>Модульные «умные» заправки с цифровыми решениями — франшиза для предпринимателей.</Text>
      <Btn icon="open-outline" label="Сайт ION Energy" onPress={() => open('https://ionenergy.kz/')} ghost />
    </>
  );
}

function Contacts() {
  const t = useT();
  return (
    <>
      <Text style={s.h1}>{t('contactsT')}</Text>
      <Text style={s.p}>г. Алматы, Турксибский район, ул. Свободная 136/2</Text>
      <View style={{ gap: 12, marginTop: 8 }}>
        <Btn icon="call" label="+7 (727) 313 25 96" onPress={() => open('tel:+77273132596')} />
        <Btn icon="mail" label="info@mercuryenergy.kz" onPress={() => open('mailto:info@mercuryenergy.kz')} ghost />
        <Btn icon="map" label={t('map')} onPress={() => open('https://yandex.kz/maps/ru/org/mercury_energy/98395703974/')} ghost />
        <Btn icon="globe-outline" label={t('site')} onPress={() => open('https://mercuryenergy.kz/ru/')} ghost />
      </View>
    </>
  );
}

function Request() {
  const t = useT();
  const [f, setF] = useState({ name: '', phone: '', fuel: 'Jet A-1', vol: '', note: '' });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const send = () => {
    if (!f.name.trim() || !f.phone.trim()) return Alert.alert(t('fill'));
    const body = [[t('fName'), f.name], [t('fPhone'), f.phone], [t('fFuel'), f.fuel], [t('fVol'), f.vol], [t('fNote'), f.note]]
      .map(([k, v]) => `${k}: ${v}`).join('\n');
    open(`mailto:info@mercuryenergy.kz?subject=${encodeURIComponent(t('subject'))}&body=${encodeURIComponent(body)}`);
  };
  const field = (label, key, extra) => (
    <>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.inp} value={f[key]} onChangeText={set(key)} placeholderTextColor={C.mute} {...extra} />
    </>
  );
  return (
    <>
      <Text style={s.h1}>{t('reqT')}</Text>
      <Text style={s.p}>{t('reqP')}</Text>
      {field(t('fName'), 'name')}
      {field(t('fPhone'), 'phone', { keyboardType: 'phone-pad' })}
      <Text style={s.label}>{t('fFuel')}</Text>
      <View style={s.chips}>
        {['Jet A-1', 'ТС-1', 'Дизель', 'Бензин'].map((x) => (
          <Pressable key={x} onPress={() => set('fuel')(x)} style={[s.chip, f.fuel === x && s.chipOn]}>
            <Text style={[s.chipT, f.fuel === x && { color: '#fff' }]}>{x}</Text>
          </Pressable>
        ))}
      </View>
      {field(t('fVol'), 'vol')}
      {field(t('fNote'), 'note', { multiline: true, style: [s.inp, { height: 90, textAlignVertical: 'top' }] })}
      <View style={{ marginTop: 20 }}><Btn icon="send" label={t('send')} onPress={send} /></View>
    </>
  );
}

const TABS = [
  ['home', 'tabHome', 'home'],
  ['prices', 'tabPrices', 'pricetag'],
  ['about', 'tabAbout', 'business'],
  ['request', 'tabRequest', 'document-text'],
  ['contacts', 'tabContacts', 'call'],
];

export default function App() {
  const [lang, setLang] = useState('ru');
  return <Lang.Provider value={lang}><Shell lang={lang} setLang={setLang} /></Lang.Provider>;
}

function Shell({ lang, setLang }) {
  const t = useT();
  const [tab, setTab] = useState('home');
  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <View style={s.logo}><Ionicons name="flash" size={18} color="#fff" /></View>
        <Text style={[s.brand, { flex: 1 }]}>Mercury Energy</Text>
        {['ru', 'kk', 'en'].map((l) => (
          <Pressable key={l} onPress={() => setLang(l)} style={[s.lang, lang === l && s.langOn]}>
            <Text style={[s.langT, lang === l && { color: '#fff' }]}>{l.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={s.body}>
        {tab === 'home' && <Home go={setTab} />}
        {tab === 'prices' && <Prices />}
        {tab === 'about' && <About />}
        {tab === 'request' && <Request />}
        {tab === 'contacts' && <Contacts />}
      </ScrollView>
      <View style={s.tabs}>
        {TABS.map(([k, label, icon]) => (
          <Pressable key={k} style={s.tab} onPress={() => setTab(k)}>
            <Ionicons name={tab === k ? icon : icon + '-outline'} size={22} color={tab === k ? C.orange : C.mute} />
            <Text style={[s.tabL, tab === k && { color: C.orange, fontWeight: '700' }]}>{t(label)}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingTop: StatusBar.currentHeight || 0 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  logo: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 18, fontWeight: '800', color: C.ink },
  body: { padding: 20, paddingBottom: 32 },
  h1: { fontSize: 28, fontWeight: '800', color: C.ink, lineHeight: 34, marginBottom: 8 },
  h2: { fontSize: 18, fontWeight: '700', color: C.ink, marginTop: 24, marginBottom: 10 },
  p: { fontSize: 15, lineHeight: 22, color: C.mute },
  mute: { fontSize: 13, color: C.mute },
  row: { flexDirection: 'row', gap: 12, marginTop: 18 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.orange, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14 },
  btnGhost: { backgroundColor: C.soft, borderWidth: 1, borderColor: C.amber },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 22 },
  fact: { width: '48%', backgroundColor: C.soft, borderRadius: 16, padding: 16 },
  factN: { fontSize: 22, fontWeight: '800', color: C.orange },
  factL: { fontSize: 13, color: C.mute, marginTop: 2 },
  news: { borderWidth: 1, borderColor: C.line, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff' },
  overlay: { flex: 1, backgroundColor: 'rgba(20,33,61,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  sheetImg: { width: '100%', height: 180, borderRadius: 16, backgroundColor: C.line },
  newsImg: { width: '100%', height: 150, backgroundColor: C.line },
  newsT: { fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 2 },
  date: { fontSize: 12, color: C.orange, fontWeight: '700' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line, gap: 12 },
  priceName: { fontSize: 16, fontWeight: '600', color: C.ink },
  price: { fontSize: 18, fontWeight: '800', color: C.orange },
  label: { fontSize: 13, fontWeight: '600', color: C.ink, marginTop: 16, marginBottom: 6 },
  inp: { borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.ink, backgroundColor: '#fff' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: C.amber, backgroundColor: C.soft },
  chipOn: { backgroundColor: C.orange, borderColor: C.orange },
  chipT: { fontSize: 14, fontWeight: '600', color: C.ink },
  lang: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, backgroundColor: C.soft },
  langOn: { backgroundColor: C.orange },
  langT: { fontSize: 12, fontWeight: '700', color: C.orange },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.line, backgroundColor: '#fff', paddingBottom: 6 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, gap: 2 },
  tabL: { fontSize: 11, color: C.mute },
});
