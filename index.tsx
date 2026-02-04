import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
interface SurgicalCode {
  id: string;
  code: string;
  name_ch: string;
  name_en: string;
}

interface SelfPaidItem {
  id: string;
  category: string;
  code: string;
  name_ch: string;
  name_en: string;
}

interface PhoneDirectoryItem {
  id: string;
  category: string;
  name: string;
  badge_id: string;
  extension: string;
}

type View = 'portal' | 'surgical' | 'selfPaid' | 'phoneDirectory';


// --- Icons ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3 11.25V21a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V16.5a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v4.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V11.25m-18 0A23.955 23.955 0 0112 3c4.618 0 8.92 1.413 12.5 3.75" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

// --- Constants (The "File" source) ---
const INITIAL_SURGICAL_CODES: SurgicalCode[] = [
    { id: '70006B', code: '70006B', name_ch: '肌肉或深部組織腫瘤切除術及異物取出術 / 移除Port-A', name_en: 'Excision of muscle or deep tissue tumor, deep foreign body (Remove Port-A)' },
    { id: '71215C', code: '71215C', name_ch: '二氧化碳雷射手術', name_en: 'CO2 laser operation' },
    { id: '71899E', code: '71899E', name_ch: '下腹動脈結紮後分離(用於產後大出血或骨盆出血)', name_en: 'Hypogastric artery ligation related to postpartum hemorrhage or uncontrolled bleeding of pelvis' },
    { id: '71882E', code: '71882E', name_ch: '子宮動脈結紮與分離', name_en: 'uterine artery ligation' },
    { id: '72301H', code: '72301H', name_ch: '腹股溝淋巴腺腫切除術', name_en: 'Excision of inguinal lymphnode' },
    { id: '72308A', code: '72308A', name_ch: '腹股溝淋巴腺腫根治清除術', name_en: 'Radical inguinal lymphnode dissection' },
    { id: '73551F', code: '73551F', name_ch: '骨盆腔淋巴腺切除術', name_en: 'Pelvic lymphadenectomy' },
    { id: '75024C', code: '75024C', name_ch: '後腹腔淋巴結摘除術', name_en: 'Retroperitoneal LN dissection' },
    { id: '75030D', code: '75030D', name_ch: '根除性淋巴結切除術', name_en: 'Radical lymphadenectomy' },
    { id: '75036H', code: '75036H', name_ch: '主動脈旁淋巴切除術', name_en: 'Paraaortic lymph node dissection' },
    { id: '75027J', code: '75027J', name_ch: '髖鼠蹊部淋巴根除術-單側', name_en: 'Ileo-inguinal lymphadenectomy, U' },
    { id: '75028I', code: '75028I', name_ch: '髖鼠蹊部淋巴根除術-雙側', name_en: 'Ileo-inguinal lymphadenectomy, Bil' },
    { id: '73001F', code: '73001F', name_ch: '腸粘連分離術', name_en: 'Enterolysis, freeing adhesion' },
    { id: '73003D', code: '73003D', name_ch: '腸粘連分離術及腸減壓', name_en: 'Enterolysis + Bowel Decompression' },
    { id: '73512G', code: '73512G', name_ch: '腸阻塞、分離腸粘連一併有腸切除及吻合', name_en: 'Intest. obstruct. lysis adh.ban with resection & anastomosis of intestine' },
    { id: '73005B', code: '73005B', name_ch: '腸粘連分離術及切除吻合', name_en: 'Enterolysis + Resect + Anastamosis' },
    { id: '73007J', code: '73007J', name_ch: '腸粘連分離術及改道', name_en: 'Enterolysis + Bypass' },
    { id: '73057E', code: '73057E', name_ch: '良性腸病灶切除術', name_en: 'Excision, Benign bowel lesion' },
    { id: '73053I', code: '73053I', name_ch: '邁克氏憩室切除術', name_en: 'Meckel\'s diverticulectomy' },
    { id: '73067B', code: '73067B', name_ch: '小腸切除術加吻合術', name_en: 'Resection of small bowel, with anastomosis' },
    { id: '73471E', code: '73471E', name_ch: '結腸部分切除術加吻合術', name_en: 'Colectomy, partial, with anastomosis' },
    { id: '73111H', code: '73111H', name_ch: '腸系膜之縫合及修補', name_en: 'Suture and repair of mesentery' },
    { id: '73002E', code: '73002E', name_ch: '腹腔鏡腸粘連剝離術', name_en: 'Laparoscopic adhesionolysis' },
    { id: '73201F', code: '73201F', name_ch: '闌尾膿瘍之引流', name_en: 'Drainage of appendiceal abscess transabdominal' },
    { id: '73202E-1', code: '73202E', name_ch: '闌尾切除術', name_en: 'Appendectomy' },
    { id: '73203D', code: '73203D', name_ch: '闌尾瘻管關閉', name_en: 'Closure of appendiceal fistula' },
    { id: '73204C-1', code: '73204C', name_ch: '腹腔鏡闌尾切除術', name_en: 'Laparoscopic appendectomy' },
    { id: '73202E-2', code: '73202E', name_ch: '闌尾切除術(自費)', name_en: 'Appendectomy' },
    { id: '73204C-2', code: '73204C', name_ch: '腹腔鏡闌尾切除術(自費)', name_en: 'Laparoscopic appendectomy' },
    { id: '73401F', code: '73401F', name_ch: '直腸周圍膿瘍之切開引流', name_en: 'Incision and drainage for periproctal abscess' },
    { id: '73410D', code: '73410D', name_ch: '薦骨與尾骨腫瘤切除,良性', name_en: 'Excision, sacrococcygeal tumor, benign' },
    { id: '73419E', code: '73419E', name_ch: '直腸膀胱瘻管切除術', name_en: 'Closure fistula, reco-vesical' },
    { id: '73532A', code: '73532A', name_ch: '腹壁膿瘍引流術', name_en: 'Drainage of abdominal wall abscess' },
    { id: '73533J', code: '73533J', name_ch: '腹壁腫瘤切除術-良性', name_en: 'Excision of abdominal wall tumor, benign' },
    { id: '73531B', code: '73531B', name_ch: '腹壁腫瘤切除術-惡性', name_en: 'Excision of abdominal wall tumor, malignant' },
    { id: '74404F', code: '74404F', name_ch: '腹壁疝氣修補術-併腸切除', name_en: 'Repair of ventral hernia with bowel resection' },
    { id: '74403G', code: '74403G', name_ch: '腹壁疝氣修補術-無腸切除', name_en: 'Repair of ventral hernia without bowel resection' },
    { id: '74409A', code: '74409A', name_ch: '腹壁疝氣修補術,嵌頓性-無腸切除', name_en: 'Repair of ventral hernia incarceration-without bowel resection' },
    { id: '74410G', code: '74410G', name_ch: '腹壁疝氣修補術,復發性-無腸切除', name_en: 'Repair of ventral hernia recurrence-without bowel resection' },
    { id: '72845G', code: '72845G', name_ch: '腹腔灌洗術', name_en: 'Abdominal lavage' },
    { id: '74408B', code: '74408B', name_ch: '腹腔膿瘍灌洗', name_en: 'Peritoneal toilet' },
    { id: '74602H', code: '74602H', name_ch: '腹腔內膿瘍引流術治療急性穿孔性腹膜炎', name_en: 'Drainage of intraabdominal abscess for acute perforation peritonitis' },
    { id: '74603G', code: '74603G', name_ch: '膈下膿瘍引流術', name_en: 'Drainage of subphrenic abscess' },
    { id: '74604F', code: '74604F', name_ch: '骨盆腔膿瘍引流術-經腹', name_en: 'Drainage of pelvic abscess, transabdominal' },
    { id: '73630H', code: '73630H', name_ch: '骨盆腔膿瘍引流術-經肛門', name_en: 'Drainage of pelvic abscess, transanal' },
    { id: '74601I', code: '74601I', name_ch: '剖腹探查術', name_en: 'Exploratory laparotomy' },
    { id: '74605E', code: '74605E', name_ch: '腹腔良性腫瘤切除術', name_en: 'Excision of intraabdominal tumor, benign' },
    { id: '74607C', code: '74607C', name_ch: '後腹腔良性腫瘤切除術', name_en: 'Excision of retroperitoneal tumor, benign' },
    { id: '74609A', code: '74609A', name_ch: '腹腔內異物卻除術', name_en: 'Removal of intraabdominal foreign body' },
    { id: '78203I', code: '78203I', name_ch: '後腹腔剖腹探查術', name_en: 'Retroperitoneal exploratory laparotomy' },
    { id: '74606D', code: '74606D', name_ch: '腹腔惡性腫瘤切除術', name_en: 'Excision of intraabdominal tumor, malignant' },
    { id: '74608B', code: '74608B', name_ch: '後腹腔惡性腫瘤切除術併後腹腔淋巴腺摘除術', name_en: 'Excision of retroperitoneal tumor, malignant with retroperitoneal lymphadenectomy' },
    { id: '74610G', code: '74610G', name_ch: '腹腔靜脈分流術', name_en: 'Peritoneo-Venous shunt' },
    { id: '74613D', code: '74613D', name_ch: '臍尿管或瘻管切除術與部分膀胱切除術', name_en: 'Excision of Urachal duct or fistula with partial cystectomy' },
    { id: '75242I', code: '75242I', name_ch: '腹式會陰尿道懸吊術', name_en: 'Abdominal perineal urethral suspension (APUS)' },
    { id: '75402A', code: '75402A', name_ch: '膀胱抽吸', name_en: 'Aspiration bladder, with catheterization' },
    { id: '75403J', code: '75403J', name_ch: '膀胱造口術-Open method', name_en: 'Cystostomy - Open method' },
    { id: '75404I', code: '75404I', name_ch: '膀胱造口術-Trocar method', name_en: 'Cystostomy - Trocar method' },
    { id: '75414F', code: '75414F', name_ch: '恥骨上膀胱造口術', name_en: 'Suprapubic cystostomy' },
    { id: '75415E', code: '75415E', name_ch: '恥骨上經皮造口術', name_en: 'Trocar suprapubic cystostomy' },
    { id: '75405H', code: '75405H', name_ch: '膀胱造口閉合', name_en: 'Closure of cystostomy' },
    { id: '75431C', code: '75431C', name_ch: '膀胱取石術', name_en: 'Cystolithotomy' },
    { id: '75418B', code: '75418B', name_ch: '膀胱部分切除術', name_en: 'Partial cystectomy' },
    { id: '75421F', code: '75421F', name_ch: '膀胱全切除術', name_en: 'Cystectomy without pelvis LND without urethrectomy without bladder reconstruction' },
    { id: '75443H', code: '75443H', name_ch: '膀胱全切除術合併尿道全切除術', name_en: 'Cystectomy without pelvis LND with urethrectomy without bladder reconstruction' },
    { id: '75422E', code: '75422E', name_ch: '膀胱全切除術合併原位新膀胱重建術', name_en: 'Cystectomy without pelvis LND without urethrectomy with orthotopic neo-bladder reconstruction' },
    { id: '75452F', code: '75452F', name_ch: '膀胱全切除術及尿道全切除術合併禁尿膀胱重建術', name_en: 'Cystectomy without pelvis LND with urethrectomy with continent reservoir reconstruction' },
    { id: '75423D', code: '75423D', name_ch: '膀胱全切除術合併骨盆腔淋巴切除術', name_en: 'Cystectomy with pelvis LND without urethrectomy without bladder reconstruction' },
    { id: '75454D', code: '75454D', name_ch: '膀胱全切除術及尿道全切除術合併骨盆腔淋巴切除術', name_en: 'Cystectomy with pelvis LND with urethrectomy without bladder reconstruction' },
    { id: '75456B', code: '75456B', name_ch: '膀胱全切除術及骨盆腔淋巴切除術及尿道全切除術合併禁尿膀胱重建術', name_en: 'Cystectomy with pelvis LND with urethrectomy with continent reservoir reconstruction' },
    { id: '75429H', code: '75429H', name_ch: '膀胱成形術或膀胱尿道成形術', name_en: 'Cystoplasty or cystourethroplasty' },
    { id: '75425B', code: '75425B', name_ch: '膀胱尿道成形術併單側或雙側輸尿管膀胱吻合術', name_en: 'Cystourethroplasty with unilateral or bilateral uretero neo cystotomy' },
    { id: '75437G', code: '75437G', name_ch: '膀胱頸尿道前固定術或尿道固定術', name_en: 'Vesicourethropexy, anteriro or Urethropexy as Marshall-Marchetti type' },
    { id: '75427J', code: '75427J', name_ch: '膀胱縫合術', name_en: 'Cystorrhaphy' },
    { id: '75417C', code: '75417C', name_ch: '膀胱陰道瘻管閉合術,由腹部開刀', name_en: 'Closure fistula, vesicovaginal abdominal approach' },
    { id: '75438F', code: '75438F', name_ch: '膀胱子宮瘻管閉合術,包含子宮切除術', name_en: 'Closure fistula, vesicouterine with or without hysterectomy' },
    { id: '75439E', code: '75439E', name_ch: '膀胱腸管成形術,包含腸吻合', name_en: 'Enterocystoplasty including bowel anastomosis' },
    { id: '75448C', code: '75448C', name_ch: '皮膚膀胱造口術', name_en: 'Cutaneous vesicostomy' },
    { id: '75416D', code: '75416D', name_ch: '經皮膀胱造療術', name_en: 'Cutaneous cystostomy' },
    { id: '75447D', code: '75447D', name_ch: '膀胱尿道鏡及輸尿管取石', name_en: 'Cystourethroscopy with removal of ureteral calculus' },
    { id: '75441J', code: '75441J', name_ch: '經尿道膀胱頸切開術', name_en: 'Tur for bladder neck' },
    { id: '75434J', code: '75434J', name_ch: '腹式尿失禁手術', name_en: 'Transabdominal urinary incontinence surgery' },
    { id: '75432B', code: '75432B', name_ch: '男性鐵弗龍注射', name_en: 'Teflon injection in man' },
    { id: '75433A', code: '75433A', name_ch: '女性鐵弗龍注射', name_en: 'Teflon injection in female' },
    { id: '75435I', code: '75435I', name_ch: '陰道式尿失禁手術(含Kelly plication)', name_en: 'Transvaginal urinary incontinence surgery (Kelly plication included)' },
    { id: '75436H', code: '75436H', name_ch: 'Burch尿失禁手術', name_en: 'Burch Colposuspension' },
    { id: '75408E', code: '75408E', name_ch: '間質性膀胱炎膀胱尿道鏡擴張術', name_en: 'Cystourethroscopy with dilation of bladder for interstitial cystitis' },
    { id: '75428I', code: '75428I', name_ch: '膀胱憩室電燒', name_en: 'Coagulation of bladder diverticulum' },
    { id: '75426A', code: '75426A', name_ch: '部份膀胱及膀胱憩室切除術', name_en: 'Partial cystectomy with excision of bladder diverticulum' },
    { id: '75419A', code: '75419A', name_ch: '膀胱破裂修補術', name_en: 'Repair of bladder rupture' },
    { id: '75413G', code: '75413G', name_ch: '小腸膀胱增大術', name_en: 'Augmentation of U-B with intestine' },
    { id: '75401B', code: '75401B', name_ch: '膀胱懸吊術', name_en: 'Suspension of urinary bladder' },
    { id: '75420G', code: '75420G', name_ch: 'KELLY手術', name_en: 'KELLY operation' },
    { id: '75630D', code: '75630D', name_ch: '尿道人工擴約肌植入術', name_en: 'Artificial urinary sphincter implantation' },
    { id: '75409D', code: '75409D', name_ch: '(後)腹腔鏡膀胱頸懸吊術', name_en: '(Retroperitoneoscopy) Laparoscopy, Bladder neck suspension' },
    { id: '75410J', code: '75410J', name_ch: '(後)腹腔鏡膀胱憩室切除術(單個或多發性者)', name_en: '(Retroperitoneoscopy) Laparoscopy, Bladder diverticulectomy' },
    { id: '75601B', code: '75601B', name_ch: '尿道結石(異物)除去術', name_en: 'Remove of urethral stone or foreign body' },
    { id: '75608E', code: '75608E', name_ch: '外尿道口息肉切除術', name_en: 'Polypectomy, external urethral' },
    { id: '75607F', code: '75607F', name_ch: '尿道腫瘤切除術', name_en: 'Resection of urethral tumor' },
    { id: '75611I', code: '75611I', name_ch: '尿道瘻管修補術(前段)', name_en: 'Urethral fistulectomy (anterior)' },
    { id: '75609D', code: '75609D', name_ch: '尿道瘻管修補術(後段)', name_en: 'Urethral fistulectomy (posterior)' },
    { id: '75634J', code: '75634J', name_ch: '尿道周膿瘍切開引流術', name_en: 'I&D for peri-urethral abscess' },
    { id: '77001H', code: '77001H', name_ch: '會陰膿腫切開引流(非產科)', name_en: 'Incision and drainage of perineal abscess (Non-obstetric)' },
    { id: '77002G', code: '77002G', name_ch: '會陰修補', name_en: 'repair of perineum' },
    { id: '77003F', code: '77003F', name_ch: '會陰修補及肛門損傷修補', name_en: 'Repair of perinueum with repair of anal defects' },
    { id: '77004E', code: '77004E', name_ch: '會陰修補及括約肌修補', name_en: 'Repair of perinueum with sphincter repair' },
    { id: '77209J', code: '77209J', name_ch: '女陰白斑切除術', name_en: 'Excision of genital leukoderma' },
    { id: '77213C', code: '77213C', name_ch: '廣泛性外陰膿瘍引流術', name_en: 'Extended drainage of external genital abscess' },
    { id: '77222A', code: '77222A', name_ch: '巴氏腺囊腫造袋術', name_en: 'Marsupialization of Bartholin\'s gland cyst' },
    { id: '77221B', code: '77221B', name_ch: '巴氏腺囊切除術', name_en: 'Excision of Bartholin\'s gland' },
    { id: '77224I', code: '77224I', name_ch: '前庭大腺囊腫切除', name_en: 'Excision of sken\'s cyst' },
    { id: '77206C', code: '77206C', name_ch: '女陰切除術或廣泛性外陰癌組織切除', name_en: 'Simple vulvectomy or wide local excision of valvar cancer' },
    { id: '77208A', code: '77208A', name_ch: '女陰切除術(合併皮膚或皮下組織重建)', name_en: 'Simple vulvectomy (with skin graft or reconstruction of subcutaneous tissue)' },
    { id: '77211E', code: '77211E', name_ch: '陰蒂切除術', name_en: 'Clitoridectomy' },
    { id: '77212D', code: '77212D', name_ch: '陰蒂整形術', name_en: 'Clitoroplasty' },
    { id: '77216J', code: '77216J', name_ch: '處女膜切開術', name_en: 'Hymenotomy' },
    { id: '77207B', code: '77207B', name_ch: '根治女陰切除術', name_en: 'Radical Vulvgectomy' },
    { id: '77217I', code: '77217I', name_ch: '處女膜重建術(自費)', name_en: 'Hymenoplasty' },
    { id: '77236D', code: '77236D', name_ch: '陰道切開探查術或骨盆腔膿腫引流', name_en: 'Vaginotomy or drainage of pelvic abscess' },
    { id: '77234F', code: '77234F', name_ch: '陰道囊腫切除術', name_en: 'Excision of vaginal cyst' },
    { id: '77233G', code: '77233G', name_ch: '陰道中膈切除術', name_en: 'Resection of vaginal Septum' },
    { id: '77225H', code: '77225H', name_ch: '陰道後穹窿切開術', name_en: 'Incision of posterior fornix' },
    { id: '77238B', code: '77238B', name_ch: '陰道縫合術(縫合陰道損傷,非產科)', name_en: 'Vaginal wall repair (Non-obstetric)' },
    { id: '77241F', code: '77241F', name_ch: '陰道會陰縫合術:縫合陰道及會陰損傷,(非產科)', name_en: 'Colpoperineorrhaphy, suture of injury of vagina and/or perineum nonobstetrical' },
    { id: '77226G', code: '77226G', name_ch: '前側陰道縫合術', name_en: 'Colporrhaphy, anterior' },
    { id: '77227F', code: '77227F', name_ch: '後側陰道縫合術', name_en: 'Colporrhaphy, Posterior' },
    { id: '77228E', code: '77228E', name_ch: '前後側陰道縫合術', name_en: 'Anterior and posterior colporrhaphy' },
    { id: '77229D', code: '77229D', name_ch: '前後側陰道縫合術:包含腸膨出修補術', name_en: 'Anterior and posterior colporrhaphy, (including repair of enterocele)' },
    { id: '77244C', code: '77244C', name_ch: '經陰道骨盆底重建手術(陰道懸吊術,陰道前後壁修補)', name_en: 'Transvaginal pelvic floor reconstruction (vaginal suspension, colporrhaphy combined anterior-posterior)' },
    { id: '77242E', code: '77242E', name_ch: '從腹腔進入陰道固定術', name_en: 'Transabdominal colpopexy' },
    { id: '77243D', code: '77243D', name_ch: '經腹腔及陰道合併之骨盆底重建術(含子宮切除術)', name_en: 'Combined abdominal and vaginal pelvic floor reconstrction (abdominal hysterectomy, sacrocolpopexy, colporrhaphy combined anterior-posterior)' },
    { id: '77260A', code: '77260A', name_ch: '經陰道骨盆底重建手術(含子宮切除術,陰道懸吊術)', name_en: 'Transvaginal pelvic floor reconstruction (transvaginal hysterectomy, sacro-spinal ligament fixation, colporrhaphy combined anterior-posterior)' },
    { id: '77254J', code: '77254J', name_ch: '麻醉下之陰道擴張術', name_en: 'Vaginal dilation under anesthesia' },
    { id: '77401H', code: '77401H', name_ch: '子宮頸擴張術', name_en: 'Cervical dilatation' },
    { id: '77257G', code: '77257G', name_ch: '腹腔鏡式骨盆腔子宮內膜異位症電燒及切除-輕度', name_en: 'Laparoscopic fulguration or excision of pelvic endometriosis Minimal to mild' },
    { id: '77258F', code: '77258F', name_ch: '腹腔鏡式骨盆腔子宮內膜異位症電燒及切除-中度', name_en: 'Laparoscopic fulguration or excision of pelvic endometriosis - Moderate' },
    { id: '77259E', code: '77259E', name_ch: '腹腔鏡式骨盆腔子宮內膜異位症電燒及切除一重度', name_en: 'Laparoscopic fulguration or excision of pelvic endometriosis Severe' },
    { id: '77231I', code: '77231I', name_ch: '陰道切除術-陰道部份切除', name_en: 'Partial resection of vagina' },
    { id: '77235E', code: '77235E', name_ch: '陰道壁廣泛切除術', name_en: 'Modified Latz-Ko\'s operation' },
    { id: '77230J', code: '77230J', name_ch: '陰道切除術-陰道全部切除,陰道式', name_en: 'Complete resection of vagina, vaginal approach' },
    { id: '77261J', code: '77261J', name_ch: '陰道切除術-陰道全部切除,腹式合併陰道式', name_en: 'Complete resection of vagina, combined abdominal and vaginal approach' },
    { id: '77232H', code: '77232H', name_ch: '陰道閉合術', name_en: 'LeFort colpocleisis' },
    { id: '77239A', code: '77239A', name_ch: '人工陰道重建術(陰道狹窄或陰道缺失)-無皮膚移植', name_en: 'Reconstruction of vagina (vaginal stenosis or vaginal defects, without skin graft)' },
    { id: '77247J', code: '77247J', name_ch: '人工陰道重建術(陰道狹窄或陰道缺失)-有皮膚及大腸等移植', name_en: 'Reconstruction of vagina (vagina stenosis or vaginal defects, with skin, colon or other graft)' },
    { id: '77248I', code: '77248I', name_ch: '利用皮膚作陰道重建術', name_en: 'Reconstruction of vagina - skin' },
    { id: '77249H', code: '77249H', name_ch: '利用大腸作陰道重建術', name_en: 'Reconstruction of vagina - colo' },
    { id: '77251C', code: '77251C', name_ch: '初次直腸陰道瘻管修補術', name_en: 'Primary recto-vaginal fistula repair' },
    { id: '77262I', code: '77262I', name_ch: '再次直腸陰道瘻管修補術', name_en: 'Recurrent recto-vaginal fistula repair' },
    { id: '77252B', code: '77252B', name_ch: '尿道陰道瘻管修補術', name_en: 'Urethral vaginal fistula repair' },
    { id: '77253A', code: '77253A', name_ch: '膀胱陰道瘻管修補術', name_en: 'Vesico vaginal fistula repair' },
    { id: '77246A', code: '77246A', name_ch: '從陰道進入之陰道固定術', name_en: 'Colpopexy, vaginal approach' },
    { id: '77245B', code: '77245B', name_ch: '腹腔鏡陰道懸吊術', name_en: 'Laparoscopic colpopexy' },
    { id: '77263H', code: '77263H', name_ch: '經腹腔之骨盆底重建術', name_en: 'Transabdominal pelvic floor reconstruction' },
    { id: '77264G', code: '77264G', name_ch: '陰道人工網膜外露修復術', name_en: 'Vaginal mesh extrusion repair' },
    { id: '77265F', code: '77265F', name_ch: '陰道式會陰尿道懸吊術', name_en: 'Vaginal perineal urethral suspension(VPUS)' },
    { id: '77417I', code: '77417I', name_ch: '陰道式子宮頸切除術', name_en: 'Vaginal trachelectomy' },
    { id: '77412D', code: '77412D', name_ch: '腹式子宮頸切除術', name_en: 'Abdominal trachelectomy' },
    { id: '77413C', code: '77413C', name_ch: '根除式子宮頸切除術', name_en: 'Radical trachelectomy' },
    { id: '77418H', code: '77418H', name_ch: '子宮頸整形術', name_en: 'Tracheloplasty' },
    { id: '78216C', code: '78216C', name_ch: '子宮頸坐縮術', name_en: 'Shirodker isthmorrhaply' },
    { id: '77419G', code: '77419G', name_ch: '子宮頸縫合術', name_en: 'Cervical cerclage' },
    { id: '93553F', code: '93553F', name_ch: '子宮頸坐縮術縫線(自費)', name_en: 'MERSILENE RS21-22 INCOMP CERVIX' },
    { id: '77416J', code: '77416J', name_ch: '子宮頸殘餘部擴張刮除術', name_en: 'Dilation and curettage of cervical stump' },
    { id: '77405D', code: '77405D', name_ch: '子宮頸楔狀切除術', name_en: 'Cervical conization' },
    { id: '77406C', code: '77406C', name_ch: '子宮頸錐狀切片(刀切)', name_en: 'Cervical conization by knife' },
    { id: '77411E', code: '77411E', name_ch: '子宮頸錐狀切片(利用雷射)', name_en: 'Uterine cervix laser conization' },
    { id: '77408A', code: '77408A', name_ch: '子宮頸切斷術', name_en: 'Cervical amputation' },
    { id: '77410F', code: '77410F', name_ch: '子宮頸蒂瘤切除術 / 子宮頸息肉切除術', name_en: 'Cervical polypectomy' },
    { id: '77407B', code: '77407B', name_ch: '陰道式殘餘子宮頸切除術', name_en: 'Vaginal excision of cervical stump' },
    { id: '77414B', code: '77414B', name_ch: '腹式殘餘子宮頸切除術', name_en: 'Abdominal excision of cervical stump' },
    { id: '77409J', code: '77409J', name_ch: '經陰道子宮懸吊合併子宮頸部份切除術', name_en: 'Manchester operation (Transvaginal uterine suspension with partial cervicectomy)' },
    { id: '77402G', code: '77402G', name_ch: '診斷性子宮擴括手術(非產科)', name_en: 'D&C for diagnosis (not OBS)' },
    { id: '77403F', code: '77403F', name_ch: '治療性子宮擴括手術(非產科)', name_en: 'D&C for treatment (not OBS)' },
    { id: '64518C', code: '64518C', name_ch: '月經規則術(自費)', name_en: 'Menstrual Regulation' },
    { id: '77601H', code: '77601H', name_ch: '一般子宮肌瘤切除術', name_en: 'Uncomplicated myomectomy' },
    { id: '77629D', code: '77629D', name_ch: '複雜性子宮肌瘤切除術', name_en: 'Complicated myomectomy' },
    { id: '77602G', code: '77602G', name_ch: '一般全子宮切除術', name_en: 'Uncomplicated total hysterectomy' },
    { id: '77630J', code: '77630J', name_ch: '複雜性全子宮切除術', name_en: 'Complicated total hysterectomy' },
    { id: '77603F', code: '77603F', name_ch: '次全子宮切除術', name_en: 'Subtotal hysterectomy' },
    { id: '77812D', code: '77812D', name_ch: '骨盆腔粘連分離術', name_en: 'Lysis of pelvic (abdominal) adhesion' },
    { id: '77823J', code: '77823J', name_ch: '輸卵管剝離術-無顯微鏡', name_en: 'Salpingolysis no microscope' },
    { id: '77608A', code: '77608A', name_ch: '子宮懸吊術', name_en: 'Uterine suspension' },
    { id: '77811E', code: '77811E', name_ch: '子宮廣韌帶裂傷修補或切除術', name_en: 'Repair or resection of broad ligament' },
    { id: '77631I', code: '77631I', name_ch: '子宮輸卵管造口吻合術', name_en: 'Hysterosalpingostomy' },
    { id: '77605D', code: '77605D', name_ch: '子宮縫合術', name_en: 'Hysterorrhaphy' },
    { id: '77604E', code: '77604E', name_ch: '子宮整形術', name_en: 'Metroplastic surgery' },
    { id: '77610F', code: '77610F', name_ch: '雙子宮整形術', name_en: 'Unitication of Uterus' },
    { id: '77813C', code: '77813C', name_ch: 'Spalding-Richardson 氏子宮脱出手術', name_en: 'Spalding-Richardson\'s operation' },
    { id: '77817I', code: '77817I', name_ch: '廣泛性全子宮切除術', name_en: 'Extended hysterectomy' },
    { id: '77819G', code: '77819G', name_ch: '子宮頸癌全子宮根除術', name_en: 'Radical hysterectomy for cervical cancer' },
    { id: '77818H', code: '77818H', name_ch: '陰道式子宮根治手術(Schauta式手術)', name_en: 'Hysterectomy vaginal radical, Schauta type procedure' },
    { id: '77614B', code: '77614B', name_ch: '子宮鏡子宮肌瘤切除術', name_en: 'Hysteroscopic myomectomy' },
    { id: '77616J', code: '77616J', name_ch: '子宮鏡下子宮腔隔膜切除術', name_en: 'Resection uterine septum,hystero' },
    { id: '77615A', code: '77615A', name_ch: '子宮鏡下子宮內膜息肉切除術', name_en: 'Hysteroscopic polypectomy' },
    { id: '77618H', code: '77618H', name_ch: '子宮鏡下子宮異物去除術', name_en: 'Hysteroscopic removal FB' },
    { id: '77617I', code: '77617I', name_ch: '子宮鏡下子宮內膜切除術', name_en: 'Endonactrial ablation, hysteros' },
    { id: '77619G', code: '77619G', name_ch: '子宮鏡下子宮內黏連剝離', name_en: 'Lysis uterine adhesion, hysteros' },
    { id: '77612D', code: '77612D', name_ch: '腹腔鏡全子宮切除術', name_en: 'Laparoscopy hysterectomy' },
    { id: '77626G', code: '77626G', name_ch: '婦癌分期手術', name_en: 'Gynecologic cancer staging surgery (BSO+omentectomy+ATH+retroperitoneal lymphadenectomy)' },
    { id: '77632H', code: '77632H', name_ch: '腹腔鏡式婦癌分期手術', name_en: 'Laparoscopic gynecologic oncology staging surgery' },
    { id: '77627F', code: '77627F', name_ch: '婦癌減積手術', name_en: 'Debulking surgery for gynecologic cancer (BSO+omentectomy+ATH+retroperitoneal lymphadenectomy+radical dissection)' },
    { id: '77628E', code: '77628E', name_ch: '婦癌二次剖腹探查術', name_en: 'Gynecologic oncology second-look laparotomy' },
    { id: '77600I', code: '77600I', name_ch: '腹腔鏡子宮肌瘤切除術', name_en: 'Laparoscopy myomectomy' },
    { id: '77805D', code: '77805D', name_ch: '輸卵管整形術', name_en: 'Salpingoplasty' },
    { id: '77809J', code: '77809J', name_ch: '輸卵管造口術-有顯微鏡', name_en: 'Salpingostomy with microscope' },
    { id: '77827F', code: '77827F', name_ch: '輸卵管補植術-無顯微鏡', name_en: 'Reimplantation no microscope' },
    { id: '77822A', code: '77822A', name_ch: '輸卵管剝離術', name_en: 'Salpingolysis with microscopic' },
    { id: '77824I', code: '77824I', name_ch: '輸卵管吻合術', name_en: 'End to end anastomosis' },
    { id: '77810F', code: '77810F', name_ch: '輸卵管造口術', name_en: 'Salpingostomy without microscopic' },
    { id: '77826G', code: '77826G', name_ch: '輸卵管補植術', name_en: 'Reimplantation with microscopic' },
    { id: '77803F', code: '77803F', name_ch: '輸卵管橫截術(自費)', name_en: 'Transection Fallopian tube' },
    { id: '77808A', code: '77808A', name_ch: '輸卵管結紮後重建手術(自費)', name_en: 'Tubal reconst. S/P T/L' },
    { id: '77815A', code: '77815A', name_ch: '腹腔鏡下輸卵管切除術(自費)', name_en: 'Salpingectomy, laparoscopic' },
    { id: '77821B', code: '77821B', name_ch: '輸卵管結紮術(自費)', name_en: 'Tubal ligation' },
    { id: '78012G', code: '78012G', name_ch: '卵巢切除術附加大網膜切除術', name_en: 'Oophorectomy with omentectomy' },
    { id: '78004H', code: '78004H', name_ch: '腹腔鏡子宮附屬器(卵巢輸卵管)部分或全部切除術-單側', name_en: 'Laparoscopic partial or complete adnexectomy, unilateral (USO/enucleation/salpingectomy)' },
    { id: '78017B', code: '78017B', name_ch: '腹腔鏡子宮附屬器(卵巢輸卵管)部分或全部切除術-雙側', name_en: 'Laparoscopic partial or complete adnexectomy, bilateral (BSO/enucleation/salpingectomy)' },
    { id: '78007E', code: '78007E', name_ch: '卵巢癌再次手術探查術', name_en: 'Second look operation for ovarian cancer' },
    { id: '78211H', code: '78211H', name_ch: '葡萄胎或絨毛膜癌除去術', name_en: 'Removal of molar pregnancy or choriocarcinoma' },
    { id: '78212G', code: '78212G', name_ch: '子宮外孕手術', name_en: 'Ectopic pregnancy operation' },
    { id: '78214E', code: '78214E', name_ch: '胎盤取出術', name_en: 'Manual removal of placenta' },
    { id: '78221E', code: '78221E', name_ch: '剖腹產術，一般，無妊娠併發症', name_en: 'Cesarean section C/S C.S' },
    { id: '78230C', code: '78230C', name_ch: '剖腹產術，複雜，有妊娠併發症', name_en: 'Cesarean section C/S C.S complicated' },
    { id: '78225A', code: '78225A', name_ch: '剖腹產術,自行要需求額外付費23000，自費(請合併開立78226J)', name_en: 'CS shortfall 23000, self-require' },
    { id: '78226J', code: '78226J', name_ch: '剖腹產術,自行要需求額外付費23000，自費(請合併開立78225A)', name_en: 'CS, self-require, extra pay 23000' },
    { id: '78222D', code: '78222D', name_ch: '前置胎盤或植入性胎盤之剖腹產', name_en: 'C/S due to placenta previa or placenta accreta' },
    { id: '78223C', code: '78223C', name_ch: '剖腹產合併次全子宮切除術', name_en: 'Subtotal hysterectomy after Cesarean section' },
    { id: '78224B', code: '78224B', name_ch: '剖腹產合併全子宮切除術', name_en: 'Total hysterectomy after Cesarean section' },
    { id: '78232A', code: '78232A', name_ch: '妊娠前十二週流產刮宮術', name_en: 'D&C (≤12.Week)' },
    { id: '78234I', code: '78234I', name_ch: '人工流產手術(自費)', name_en: 'D&C, OBS' },
    { id: '78233J', code: '78233J', name_ch: '妊娠超過十二週流產或死胎刮宮術', name_en: 'D&C (>12.Week)' },
    { id: '78235H', code: '78235H', name_ch: '引產無效後之流產或死胎刮宮術', name_en: 'Dilation and evacuation after induction failure' },
    { id: '78242H', code: '78242H', name_ch: '療病流產:以擴張及括除包括吸出括除', name_en: 'Therapeutic abortion by D&C S&C' },
    { id: '78236G', code: '78236G', name_ch: '子宮內管刮除術', name_en: 'Endocervical curettage (ECC)' },
    { id: '78243G', code: '78243G', name_ch: '子宮切開流產術', name_en: 'Hysterotomy for termination of pregnancy' },
    { id: '78245E', code: '78245E', name_ch: '死胎之引產(12-24週)', name_en: 'Medical induction for fetal death (12-24 weeks)' },
    { id: '78246D', code: '78246D', name_ch: '死胎之引產(超過24週)', name_en: 'Medical induction for fetal death (after 24 weeks)' },
    { id: '78244F', code: '78244F', name_ch: '死胎破取術', name_en: 'Destruction of the dead fetus' },
    { id: '77613C', code: '77613C', name_ch: '骨盤腔臟器摘除術', name_en: 'Pelvic exenteration-Total or Anterior or Posterior' },
    { id: '77624I', code: '77624I', name_ch: '經腹部子宮內避孕器移除術', name_en: 'Transabdominal removal of intrauterine device' },
    { id: '77625H', code: '77625H', name_ch: '薦骨前神經截斷術', name_en: 'Pre-sacral neurectomy' },
    { id: '77633G', code: '77633G', name_ch: '腹腔鏡式薦骨前神經截斷術', name_en: 'Laparoscopic pre-sacral neurectomy' },
    { id: '77701C', code: '77701C', name_ch: '無妊娠併發症之陰道產', name_en: 'Vaginal delivery in normal pregnancy' },
    { id: '77707G', code: '77707G', name_ch: '有妊娠併發症之陰道產', name_en: 'Vaginal delivery in complicated pregnancy (defined as cases with preeclampsia, eclampsia, GDM, malpresentation, and documented major medical or surgical complications)' },
    { id: '77702B', code: '77702B', name_ch: '雙胎分娩', name_en: 'Vaginal delivery of twins' },
    { id: '77703A', code: '77703A', name_ch: '多胎分娩', name_en: 'Vaginal delivery of multiple pregnancy' },
    { id: '78213F', code: '78213F', name_ch: '腹腔鏡子宮外孕手術(含腹腔鏡子宮外孕藥物注射)', name_en: 'Laparoscopic surgery for ectopic pregnancy (including laparoscopic local injection)' },
    { id: '78011H', code: '78011H', name_ch: '骨盆腔惡性腫瘤消滅術', name_en: 'Debulking operation for pelvic cancer' },
    { id: '77801H', code: '77801H', name_ch: '子宮附屬器(卵巢輸卵管)部份或全部切除-單側', name_en: 'Partial or complete adnexectomy, unilateral (USO/enucleation/salpingectomy)' },
    { id: '77802G', code: '77802G', name_ch: '子宮附屬器(卵巢輸卵管)部份或全部切除-雙側', name_en: 'Partial or complete adnexectomy, bilateral (BSO/enucleation/salpingectomy)' },
    { id: '78006F', code: '78006F', name_ch: '卵巢膿瘍切開引流術', name_en: 'Incision and drainage of ovarian abscess' },
    { id: '78002J', code: '78002J', name_ch: '卵巢部份切片術', name_en: 'Biopsy ovary, incisional' },
    { id: '43417D', code: '43417D', name_ch: '膀胱鏡檢', name_en: 'Fibrocystoscopy' },
    { id: '43453F', code: '43453F', name_ch: '診斷性子宮鏡', name_en: 'Diagnostic hysteroscopy' },
    { id: '77421B', code: '77421B', name_ch: '生殖道息肉切除', name_en: 'Genital tract polypectomy / Vaginal cuff polypectomy' },
    { id: '40617E', code: '40617E', name_ch: '人工血管置入手術', name_en: 'Port-A set up' },
    { id: '54301B', code: '54301B', name_ch: '移除雙J導管', name_en: 'Remove D-J / Removal of double J cath.' },
    { id: '64504J', code: '64504J', name_ch: '子宮內避孕器植入(自費)', name_en: 'IUD insertion, pay self' },
    { id: '64511J', code: '64511J', name_ch: '移除子宮內避孕器(看的到線，自費)', name_en: 'Removal IUD with Tail(pay self)' },
    { id: '64512I', code: '64512I', name_ch: '移除子宮內避孕器(看不到線，自費)', name_en: 'Removal IUD without Tail(pay self)' },
    { id: '64620C', code: '64620C', name_ch: '移除子宮內避孕器(看不到線，上麻，健保)', name_en: 'Removal IUD(& dilataton anesthe)' },
    { id: '77266E', code: '77266E', name_ch: '達文西腹腔鏡下陰道懸吊術', name_en: 'Robotic (DaVinci) Vaginal suspension' },
    { id: '77634F', code: '77634F', name_ch: '達文西子宮完全切除術', name_en: 'Robotic (DaVinci) total hysterectomy' },
    { id: '77635E', code: '77635E', name_ch: '達文西腹腔鏡子宮肌瘤切除術', name_en: 'Robotic (DaVinci) myomectomy' },
    { id: '77642E', code: '77642E', name_ch: '達文西次全子宮切除術', name_en: 'Robotic (DaVinci) subtotal hysterectomy' },
    { id: '78018A', code: '78018A', name_ch: '達文西腹腔鏡卵巢部分或全部切除術，單側', name_en: 'Robotic (DaVinci) USO/enucleation/salpingectomy' },
    { id: '78019J', code: '78019J', name_ch: '達文西腹腔鏡卵巢部分或全部切除術，雙側', name_en: 'Robotic (DaVinci) BSO/enucleation/salpingectomy' },
    { id: '77636D', code: '77636D', name_ch: '達文西腹腔鏡式婦癌分期手術', name_en: 'Robotic (DaVinci) staging surgery' },
    { id: '77643D', code: '77643D', name_ch: '達文西骨盆腔子宮內膜異位電燒切除', name_en: 'Robotic (DaVinci) electrocauterization of endometriosis' },
    { id: '77638B', code: '77638B', name_ch: '腹腔鏡骨盆腔沾黏分離術', name_en: 'Laparoscopic pelvic adhesiolysis' },
    { id: '77639A', code: '77639A', name_ch: '腹腔鏡子宮懸吊術', name_en: 'Laparoscopic uterine suspension' },
    { id: '77640G', code: '77640G', name_ch: '腹腔鏡卵巢懸吊術', name_en: 'Laparoscopic ovarian transposition' },
    { id: '77641F', code: '77641F', name_ch: '腹腔鏡全子宮根除手術', name_en: 'Laparoscopic radical hysterectomy' },
    { id: '77806C', code: '77806C', name_ch: '腹腔鏡輸卵管整形術', name_en: 'Laparoscopic tuboplasty' },
    { id: '64611E', code: '64611E', name_ch: '菜花/尖形濕疣雷射燒灼/電燒', name_en: 'Condyloma laser vaporization' },
    { id: '77201H', code: '77201H', name_ch: '陰唇切片', name_en: 'Excisional biopsy of vulva' },
    { id: '43411J', code: '43411J', name_ch: '膀胱鏡檢', name_en: 'Cystoscopy' },
    { id: '64031I', code: '64031I', name_ch: '產後出血確認出血', name_en: 'Ante/Post partum hemorrhange, Check bleeding' },  
    { id: '43191A', code: '43191A', name_ch: '診斷性腹腔鏡', name_en: 'Diagnostic laparoscopy' },
    { id: '77830J', code: '77830J', name_ch: '近紅外線內視鏡輔助微創手術 / 前哨淋巴結', name_en: 'Near infrared assisted endoscopic surgery / ICG / Sentinel LN' },
];

const SELF_PAID_CATEGORIES = ["手術器械", "止血", "防沾黏", "傷口敷料", "縫線", "病理", "HIPEC", "檢體袋", "傷口撐開器", "其他"];

const INITIAL_SELF_PAID_ITEMS: SelfPaidItem[] = [
    { id: '97123', category: '手術器械', code: '97123', name_ch: '雙極雷聲刀/雷神刀', name_en: 'Thunderbeat' },
    { id: '97127', category: '手術器械', code: '97127', name_ch: '利嘉修爾含塗層馬里蘭鉗口單一(開腹/腹腔鏡)', name_en: 'Ligasure Maryland open/scope' },
    { id: '96696', category: '手術器械', code: '96696', name_ch: '柯惠利嘉修爾鈍頭閉合器/切割器', name_en: 'Ligasure(直頭)' },
    { id: '93129', category: '手術器械', code: '93129', name_ch: '可重消shaver/卡爾斯特關節鏡沖洗套管組', name_en: 'shaver' },
    { id: '98585', category: '手術器械', code: '98585', name_ch: '史耐輝子宮鏡切除器/單次用速潔刀(冷刀)', name_en: 'Truclear Ultra Reciprocating / "Smith & Nephew" Hysteroscopic Morcellation System' },
    { id: '93552', category: '手術器械', code: '93552', name_ch: '"愛惜康”安喜凝強化型組織密封器NSLX137C', name_en: 'Enseal 25cm/37cm/45cm' },
    { id: '97244', category: '止血', code: '97244', name_ch: '愛惜康”斯爾止可吸收性止血粉 (腹腔鏡要加開97239)', name_en: 'Surgicel powder' },
    { id: '97239', category: '止血', code: '97239', name_ch: '愛惜康內視鏡施藥器', name_en: 'Surgicel powder tube' },
    { id: '96961', category: '止血', code: '96961', name_ch: '克滲凝外科手術封合劑 4mL (腹腔鏡要加開97510)', name_en: 'Coseal' },
    { id: '97510', category: '止血', code: '97510', name_ch: 'Coseal 腹腔鏡噴管', name_en: 'Coseal tube' },
    { id: '91961', category: '止血', code: '91961', name_ch: '巴德亞瑞絲達可吸收止血顆粒 1g', name_en: 'Arista (1g)' },
    { id: '91962', category: '止血', code: '91962', name_ch: '巴德亞瑞絲達可吸收止血顆粒 3g', name_en: 'Arista (3g)' },
    { id: '91963', category: '止血', code: '91963', name_ch: '普蘭堤可吸收性止血劑及敷料-1g (腹腔鏡要加開91966)', name_en: '4DryField 1g' },
    { id: '91964', category: '止血', code: '91964', name_ch: '普蘭堤可吸收性止血劑及敷料-3g (腹腔鏡要加開91966)', name_en: '4DryField 3g' },
    { id: '91965', category: '止血', code: '91965', name_ch: '普蘭堤可吸收性止血劑及敷料-5g (腹腔鏡要加開91966)', name_en: '4DryField 5g' },
    { id: '91966', category: '止血', code: '91966', name_ch: '4DryField 腹腔鏡噴管', name_en: '4DryField tube' },
    { id: '91952', category: '止血', code: '91952', name_ch: '止血凝膠粉/冰沙', name_en: 'Spongostan' },
    { id: '99655', category: '止血', code: '99655', name_ch: '伏血凝止血劑-百特5mL', name_en: 'Floseal 5ml' },
    { id: '97508', category: '止血', code: '97508', name_ch: '伏血凝止血劑-百特10mL', name_en: 'Floseal 10ml' },
    { id: '97507', category: '止血', code: '97507', name_ch: '幾丁聚醣敷料(止血棉)/幾丁質', name_en: 'Chitosan wound dressing 2x3cm' },
    { id: '91960', category: '止血', code: '91960', name_ch: '斯爾弗止血劑', name_en: 'Surgiflow' },
    { id: '97362', category: '止血', code: '97362', name_ch: '潔美快可敷片/美國爸爸', name_en: 'Quikclit止血棉' },
    { id: '94063', category: '止血', code: '94063', name_ch: '急救填塞繃帶-含X光線(10x20cm)', name_en: 'Hemo-bandage X-ray detectable (10x20cm)' },
    { id: '94064', category: '止血', code: '94064', name_ch: '急救填塞繃帶-含X光線(10x40cm)', name_en: 'Hemo-bandage X-ray detectable (10x40cm)' },
    { id: '97237', category: '止血', code: '97237', name_ch: '百歐瑟 宜莫斯加強型止血粉 3g', name_en: 'Plus Haemostatic Powder 3g / HaemoCer' },
    { id: '97204', category: '止血', code: '97204', name_ch: '百歐瑟 宜莫斯加強型止血粉5g', name_en: 'Plus Haemostatic Powder 5g/HaemoCer' },
    { id: '98544', category: '防沾黏', code: '98544', name_ch: '', name_en: 'Interceed' },
    { id: '99584', category: '防沾黏', code: '99584', name_ch: '亞諾貝爾凝膠(開放式手術用)防沾黏/鴨肉', name_en: 'Hyalobarrier (Open)' },
    { id: '99585', category: '防沾黏', code: '99585', name_ch: '亞諾貝爾凝膠(內視鏡子宮鏡用)防沾黏/鴨肉', name_en: 'Hyalobarrier (Laparoscopy / Endoscopy/Hysteroscopy)' },
    { id: '98538', category: '防沾黏', code: '98538', name_ch: '瀚醫生技防粘連可吸收膠10mL', name_en: 'Barrigel (10ML)' },
    { id: '98539', category: '防沾黏', code: '98539', name_ch: '瀚醫生技防粘連可吸收膠5mL', name_en: 'Barrigel (5ML)' },
    { id: '95222', category: '防沾黏', code: '95222', name_ch: '宮安康', name_en: 'MateRegen' },
    { id: '98546', category: '防沾黏', code: '98546', name_ch: '聚乳酸防沾粘/玻璃紙(小)', name_en: 'Surgiwrap' },
    { id: '98548', category: '防沾黏', code: '98548', name_ch: '聚乳酸防沾粘/玻璃紙(大)', name_en: 'Surgiwrap 大' },
    { id: '99905', category: '防沾黏', code: '99905', name_ch: '適福生化吸收膜/糖果紙/糯米紙1片', name_en: 'Seprafilm 1片' },
    { id: '97203', category: '防沾黏', code: '97203', name_ch: '適福生化吸收膜/糖果紙/糯米紙6片', name_en: 'Seprafilm 6片' },
    { id: '98541', category: '防沾黏', code: '98541', name_ch: '玻達癒', name_en: 'Protahere' },
    { id: '98545', category: '防沾黏', code: '98545', name_ch: '百特克沾黏溶液/水', name_en: 'Adept' },
    { id: '97194', category: '傷口敷料', code: '97194', name_ch: '速原水性創傷敷料5mL', name_en: 'NewEpi 5ml' },
    { id: '97196', category: '傷口敷料', code: '97196', name_ch: '速原水性創傷敷料 10mL', name_en: 'NewEpi 10ml' },
    { id: '97092', category: '傷口敷料', code: '97092', name_ch: '癒立安膠原蛋白敷料', name_en: 'Healiaid' },
    { id: '97378', category: '傷口敷料', code: '97378', name_ch: '保盛液態敷料 6mL', name_en: 'JeanCean 6mL' },
    { id: '93082', category: '傷口敷料', code: '93082', name_ch: '皮膚釘', name_en: 'Skin staples' },
    { id: '92121', category: '傷口敷料', code: '92121', name_ch: '美容膠', name_en: '3M skin tape' },
    { id: '93095', category: '傷口敷料', code: '93095', name_ch: '愛惜康得美棒皮膚黏膠劑', name_en: 'Dermabond' },
    { id: '93109', category: '傷口敷料', code: '93109', name_ch: '愛惜康得美棒皮膚接合自黏網片/傷口Mesh + 膠水', name_en: 'Dermabond + mesh' },
    { id: '98540', category: '傷口敷料', code: '98540', name_ch: '柏朗組織黏膠', name_en: 'Histoacryl' },
    { id: '93103', category: '傷口敷料', code: '93103', name_ch: '速近傷口黏膠劑', name_en: 'Surgiseal' },
    { id: '93115', category: '傷口敷料', code: '93115', name_ch: '荷美敷高黏度組織黏著劑', name_en: 'TissueAid' },
    { id: '93121', category: '傷口敷料', code: '93121', name_ch: '艾曼斯立可棒皮膚黏膠劑', name_en: 'LiquiBand' },
    { id: '93142', category: '傷口敷料', code: '93142', name_ch: '“百麗”愛麗敷皮膚黏膠', name_en: 'Exofin Topical Skin Adhesive' },
    { id: '97406', category: '傷口敷料', code: '97406', name_ch: '舒洙水性創傷敷料 10mL', name_en: 'LACTERA liquid wound dressing (Non-Sterile) 10mL' },
    { id: '93556', category: '縫線', code: '93556', name_ch: '柯惠可吸收傷口縫合裝置', name_en: 'VLOC/V-LOC/V LOC' },
    { id: '93093', category: '縫線', code: '93093', name_ch: '魚骨線(單頭)/愛惜康外科用可吸收傷口吻合裝置(單頭針)', name_en: 'Stratafix' },
    { id: '93094', category: '縫線', code: '93094', name_ch: '魚骨線(雙頭)/愛惜康外科用可吸收傷口吻合裝置(雙頭針)', name_en: 'Stratafix' },
    { id: '93107', category: '縫線', code: '93107', name_ch: '魚骨線(對稱)/愛惜康思達飛抗菌對稱型免打結', name_en: 'Stratafix symmetrical' },
    { id: '46001', category: '病理', code: '46001', name_ch: '外院病理閱片', name_en: 'Consultation Pathology report' },
    { id: '46036', category: '病理', code: '46036', name_ch: '免疫染色', name_en: 'Immunohistochemistry (IHC)' },
    { id: '46137', category: '病理', code: '46137', name_ch: 'BRCA 慧智/組織', name_en: 'BRCA1/2 mutation_tissue (SOFIVA)' },
    { id: '46138', category: '病理', code: '46138', name_ch: 'BRCA 慧智/抽血', name_en: 'BRCA1/2 gene test_Blood(SOFIVA)' },
    { id: '46141', category: '病理', code: '46141', name_ch: '慧智 HRD', name_en: 'HRD Testing(SOFIVA)' },
    { id: '46143', category: '病理', code: '46143', name_ch: '慧智 CGP/大套組', name_en: 'BRCA, CGP(SOFIVA)' },
    { id: '46018', category: '病理', code: '46018', name_ch: '腫瘤組織切片寶(限病人院外送檢', name_en: 'Tumor recut' },
    { id: '46123', category: '病理', code: '46123', name_ch: '行動基因 HRD', name_en: 'NGS-ACTHRD(24 genes)' },
    { id: '93110', category: 'HIPEC', code: '93110', name_ch: '潤德保福腹腔溫熱灌注管路組', name_en: '' },
    { id: '54088', category: 'HIPEC', code: '54088', name_ch: '體腔溫熱化學治療', name_en: '' },
    { id: '90378', category: 'HIPEC', code: '90378', name_ch: '保福腹腔溫熱灌注導管*4', name_en: '' },
    { id: '96916', category: '檢體袋', code: '96916', name_ch: '安培亞歷西斯檢體袋-3400ml/癌症刀/腹腔鏡分期手術用', name_en: 'Alexis contained extraction 3400ml' },
    { id: '99349', category: '檢體袋', code: '99349', name_ch: '組織標本擷取袋(內視鏡組織置入袋)', name_en: 'Endo catch 標本袋' },
    { id: '96911', category: '檢體袋', code: '96911', name_ch: '安培內視鏡專用檢體袋', name_en: 'Endo catch 標本袋(安培)' },
    { id: '96908', category: '檢體袋', code: '96908', name_ch: '曲克檢體袋', name_en: 'COOK LAPSAC, 8X10 INCH, 1500ML' },
    { id: '93096', category: '傷口撐開器', code: '93096', name_ch: '大吉士傷口撐開器(80mm)/底座', name_en: 'LAGIS 80mm' },
    { id: '93591', category: '傷口撐開器', code: '93591', name_ch: '大吉士傷口撐開器(60mm)/底座', name_en: 'LAGIS 60mm' },
    { id: '96703', category: '傷口撐開器', code: '96703', name_ch: '大吉士複埠式導入套管組/整座/黑白', name_en: 'LAGIS Port' },
    { id: '93585', category: '傷口撐開器', code: '93585', name_ch: '腹腔鏡用端口(奈利斯)/整座/橘藍', name_en: 'Glove Port' },
    { id: '96711', category: '傷口撐開器', code: '96711', name_ch: '艾力克斯腹壁牽引器(L)/剖腹用/C/S', name_en: 'Alexis(L)' },
    { id: '96716', category: '傷口撐開器', code: '96716', name_ch: '艾力克斯腹壁牽引器(XS)', name_en: 'Alexis(XS)' },
    { id: '55900', category: '其他', code: '55900', name_ch: '3D腹腔鏡', name_en: '3D Laparoscopy' },
    { id: '94059', category: '其他', code: '94059', name_ch: '肯特利壓縮套/促進雙腿血液回流/氣壓腳套', name_en: 'KENDALL SCD Sequential Compression Comfort Sleeves' },
];

const PHONE_CATEGORIES = ["主治醫師", "住院醫師", "專科護理師", "檢查單位", "門診", "產房", "個管師", "急診"];

const INITIAL_PHONE_DIRECTORY_ITEMS: PhoneDirectoryItem[] = [
    { id: '3721B', category: '主治醫師', name: '李如悅', badge_id: '3721B', extension: '70656' },
    { id: '0779J', category: '主治醫師', name: '劉文雄', badge_id: '0779J', extension: '70667' },
    { id: '0749E', category: '主治醫師', name: '卓福男', badge_id: '0749E', extension: '70650' },
    { id: '2787C', category: '主治醫師', name: '陳三農', badge_id: '2787C', extension: '70663' },
    { id: '3837B', category: '主治醫師', name: '林立德', badge_id: '3837B', extension: '70661' },
    { id: '3578J', category: '主治醫師', name: '崔冠濠', badge_id: '3578J', extension: '70653' },
    { id: '0158E', category: '主治醫師', name: '蔣安仁', badge_id: '0158E', extension: '70668' },
    { id: '4618D', category: '主治醫師', name: '蔡曉文', badge_id: '4618D', extension: '70198' },
    { id: '4481D', category: '主治醫師', name: '陳其葳', badge_id: '4481D', extension: '70043' },
    { id: 'H048D', category: '主治醫師', name: '林佩萱', badge_id: 'H048D', extension: '70674' },
    { id: 'F964A', category: '主治醫師', name: '陳昱蓁', badge_id: 'F964A', extension: '70666' },
    { id: '4861F', category: '主治醫師', name: '蔡祥維', badge_id: '4861F', extension: '70412' },
    { id: 'A067J', category: '主治醫師', name: '林柏文', badge_id: 'A067J', extension: '70597' },
    { id: 'A543G', category: '主治醫師', name: '周靜汶', badge_id: 'A543G', extension: '70161' },
    { id: 'H056E', category: '住院醫師', name: '宋潔', badge_id: 'H056E', extension: '70478' },
    { id: 'A294J', category: '主治醫師', name: '李宜姍', badge_id: 'A294J', extension: '70511' },
    { id: 'A295G', category: '主治醫師', name: '許乃元', badge_id: 'A295G', extension: '70513' },
    { id: 'A385E', category: '住院醫師', name: '魯羽珈', badge_id: 'A385E', extension: '70068' },
    { id: 'H752H', category: '住院醫師', name: '嚴心勵', badge_id: 'H752H', extension: '70063' },
    { id: 'A507E', category: '住院醫師', name: '黃雙雙', badge_id: 'A507E', extension: '70864' },
    { id: 'A636F', category: '住院醫師', name: '顏嫚萱', badge_id: 'A636F', extension: '70596' },
    { id: 'U546', category: '住院醫師', name: '許嘉芸', badge_id: 'U546', extension: '70247' },
    { id: 'U611', category: '住院醫師', name: '許湘鈴', badge_id: 'U611', extension: '70539' },
    { id: '0262', category: '專科護理師', name: '李青萍', badge_id: '0262', extension: '79597' },
    { id: '1934', category: '專科護理師', name: '安雅芬', badge_id: '1934', extension: '79652' },
    { id: '3217', category: '專科護理師', name: '林子涵', badge_id: '3217', extension: '79657' },
    { id: '4228', category: '專科護理師', name: '謝佳玲', badge_id: '4228', extension: '79598' },
    { id: '4531', category: '專科護理師', name: '莊亦虹', badge_id: '4531', extension: '79662' },
    { id: '5833', category: '專科護理師', name: '黃美娟', badge_id: '5833', extension: '79679' },
    { id: '4522', category: '專科護理師', name: '魏佩秋', badge_id: '4522', extension: '79101' },
    { id: 'F499', category: '專科護理師', name: '黃湘羽', badge_id: 'F499', extension: '79665' },
    { id: '74016', category: '檢查單位', name: '3F超音波室', badge_id: '', extension: '74016' },
    { id: '77094', category: '檢查單位', name: '1F門診超音波室', badge_id: '', extension: '77094' },
    { id: '78231', category: '檢查單位', name: '生殖中心', badge_id: '', extension: '78231' },
    { id: '74015', category: '檢查單位', name: '優生遺傳實驗室/素娟', badge_id: '', extension: '74015' },
    { id: '77041', category: '檢查單位', name: '尿動室', badge_id: '', extension: '77041' },
    { id: '78276', category: '門診', name: '門診診前', badge_id: '', extension: '78276' },
    { id: '77004', category: '門診', name: '婦產科2診', badge_id: '', extension: '77004' },
    { id: '77043', category: '門診', name: '婦產科3診', badge_id: '', extension: '77043' },
    { id: '77044', category: '門診', name: '婦產科5診', badge_id: '', extension: '77044' },
    { id: '78192', category: '產房', name: '產房護理站1', badge_id: '', extension: '78192' },
    { id: '74215', category: '產房', name: '產房護理站2', badge_id: '', extension: '74215' },
    { id: '74035', category: '產房', name: '產房手術室1/產一/產1', badge_id: '', extension: '74035' },
    { id: '74036', category: '產房', name: '產房手術室2/產二/產2', badge_id: '', extension: '74036' },
    { id: '74037', category: '產房', name: '產房手術室3/產三/產3/C/S', badge_id: '', extension: '74037' },
    { id: '74038', category: '產房', name: '取卵手術室/無菌室', badge_id: '', extension: '74038' },
    { id: '74039', category: '產房', name: '產房恢復室', badge_id: '', extension: '74039' },
    { id: '74030', category: '個管師', name: '產科個管師/沛芸/雅菁', badge_id: '', extension: '74030' },
    { id: '79644', category: '個管師', name: '產科個管師沛芸', badge_id: '', extension: '79644' },
    { id: '79730', category: '個管師', name: '產科個管師雅菁', badge_id: '', extension: '79730' },
    { id: '79806', category: '個管師', name: '婦癌個管師/文英', badge_id: '', extension: '79806' },
    { id: '76208', category: '檢查單位', name: '放射線櫃台/問CT報告', badge_id: '', extension: '76208' },
    { id: '76228', category: '檢查單位', name: 'HSG/salpingo', badge_id: '', extension: '76228' },
    { id: '76400', category: '檢查單位', name: 'Bone scan/WBBS', badge_id: '', extension: '76400' },
    { id: '76421', category: '檢查單位', name: 'PET scan', badge_id: '', extension: '76421' },
    { id: '76422', category: '檢查單位', name: 'PET scan', badge_id: '', extension: '76422' },
    { id: '76210', category: '檢查單位', name: 'MRI報告', badge_id: '', extension: '76210' },
    { id: '76300', category: '檢查單位', name: '病理櫃台/pathology', badge_id: '', extension: '76300' },
    { id: '77060', category: '急診', name: '急診外科/外急/外傷', badge_id: '', extension: '77060' },
    { id: '77025', category: '急診', name: '急診內科/內急', badge_id: '', extension: '77025' },
    { id: '77011', category: '急診', name: '急救間', badge_id: '', extension: '77011' },
    { id: '77009', category: '急診', name: '急診檢傷', badge_id: '', extension: '77009' },
];


// --- Shared Components ---
const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const keywords = highlight.trim().split(/\s+/).filter(Boolean).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (keywords.length === 0) return <span>{text}</span>;
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-yellow-200 px-0 rounded">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// --- View: Portal ---
const PortalView: React.FC<{ setView: (v: View) => void }> = ({ setView }) => (
  <div className="max-w-4xl mx-auto py-12 px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">VGHKS 醫療助手平台</h2>
      <p className="text-lg text-gray-600">快速查詢手術碼、自費項目及醫院常用分機</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <button 
        onClick={() => setView('surgical')}
        className="glass-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center group"
      >
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
          <DocumentIcon className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">手術碼查詢</h3>
        <p className="text-gray-500 text-sm">查詢高榮手術對應代碼與名稱</p>
      </button>

      <button 
        onClick={() => setView('selfPaid')}
        className="glass-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center group"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
          <CreditCardIcon className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">自費項目查詢</h3>
        <p className="text-gray-500 text-sm">醫材、病理及各項自費代碼查詢</p>
      </button>

      <button 
        onClick={() => setView('phoneDirectory')}
        className="glass-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center group"
      >
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
          <PhoneIcon className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">分機查詢</h3>
        <p className="text-gray-500 text-sm">醫院各科室、醫師及檢查單位分機</p>
      </button>
    </div>
  </div>
);

// --- View: Surgical Search ---
const SurgicalSearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const k = query.toLowerCase().split(' ').filter(x => x.trim());
    if (k.length === 0) return [];
    return INITIAL_SURGICAL_CODES.filter(item => {
      const text = `${item.code} ${item.name_ch} ${item.name_en}`.toLowerCase();
      return k.every(word => text.includes(word));
    });
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-primary-700 mb-4 flex items-center gap-2">
          <DocumentIcon className="w-7 h-7" /> 高榮手術碼查詢
        </h2>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input 
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="輸入關鍵字 (代碼、中文或英文名稱)..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 text-lg"
            autoFocus
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {query ? (
          filtered.length > 0 ? (
            filtered.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-300 transition-colors">
                <span className="text-primary-600 font-bold text-sm tracking-widest uppercase"><HighlightedText text={item.code} highlight={query} /></span>
                <h4 className="text-lg font-bold text-gray-800 mt-2 leading-snug"><HighlightedText text={item.name_ch} highlight={query} /></h4>
                <p className="text-gray-500 text-sm mt-3"><HighlightedText text={item.name_en} highlight={query} /></p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">查無結果</div>
          )
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 italic">請輸入關鍵字開始查詢</div>
        )}
      </div>
    </div>
  );
};

// --- View: Self Paid Search ---
const SelfPaidSearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const categorized = cat ? INITIAL_SELF_PAID_ITEMS.filter(i => i.category === cat) : INITIAL_SELF_PAID_ITEMS;
    const k = query.toLowerCase().split(' ').filter(x => x.trim());
    if (k.length === 0) return categorized;
    return categorized.filter(item => {
      const text = `${item.code} ${item.name_ch} ${item.name_en} ${item.category}`.toLowerCase();
      return k.every(word => text.includes(word));
    });
  }, [query, cat]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
          <CreditCardIcon className="w-7 h-7" /> 自費項目查詢
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜尋名稱或代碼..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setCat(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!cat ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              全部
            </button>
            {SELF_PAID_CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === c ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-green-600 font-bold text-sm"><HighlightedText text={item.code} highlight={query} /></span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium">{item.category}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 leading-snug"><HighlightedText text={item.name_ch} highlight={query} /></h4>
              <p className="text-gray-500 text-sm mt-3"><HighlightedText text={item.name_en} highlight={query} /></p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">查無結果</div>
        )}
      </div>
    </div>
  );
};

// --- View: Phone Directory ---
const PhoneDirectoryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const categorized = cat ? INITIAL_PHONE_DIRECTORY_ITEMS.filter(i => i.category === cat) : INITIAL_PHONE_DIRECTORY_ITEMS;
    const k = query.toLowerCase().split(' ').filter(x => x.trim());
    if (k.length === 0) return categorized;
    return categorized.filter(item => {
      const text = `${item.name} ${item.extension} ${item.badge_id} ${item.category}`.toLowerCase();
      return k.every(word => text.includes(word));
    });
  }, [query, cat]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <PhoneIcon className="w-7 h-7" /> 常用分機查詢
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜尋姓名、職位或分機..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setCat(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!cat ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              全部
            </button>
            {PHONE_CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === c ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:border-orange-300 transition-colors">
              <div>
                <div className="flex justify-between items-start">
                   <h4 className="text-lg font-bold text-gray-800"><HighlightedText text={item.name} highlight={query} /></h4>
                   <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-bold uppercase">{item.category}</span>
                </div>
                {item.badge_id && <p className="text-gray-400 text-xs mt-1">ID: {item.badge_id}</p>}
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Ext</span>
                <span className="text-3xl font-black text-orange-600 tabular-nums tracking-tighter"><HighlightedText text={item.extension} highlight={query} /></span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">查無結果</div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [view, setView] = useState<View>('portal');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setView('portal')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <DocumentIcon className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">VGHKS Assistant</span>
          </button>
          
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => setView('portal')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'portal' ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-50'}`}>首頁</button>
            <button onClick={() => setView('surgical')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'surgical' ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-50'}`}>手術碼</button>
            <button onClick={() => setView('selfPaid')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'selfPaid' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:bg-gray-50'}`}>自費</button>
            <button onClick={() => setView('phoneDirectory')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'phoneDirectory' ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-50'}`}>分機</button>
          </nav>

          {view !== 'portal' && (
            <button 
              onClick={() => setView('portal')}
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
              title="回首頁"
            >
              <HomeIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        {view === 'portal' && <PortalView setView={setView} />}
        {view === 'surgical' && <SurgicalSearchView />}
        {view === 'selfPaid' && <SelfPaidSearchView />}
        {view === 'phoneDirectory' && <PhoneDirectoryView />}
      </main>

      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} VGHKS Assistant Platform. 資料即時讀取原始檔，確保最新內容。
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- Entry Point ---
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}
