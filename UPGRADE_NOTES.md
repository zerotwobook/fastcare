# Fastcare — Care services upgrade

ปรับต่อจากโปรเจกต์เดิม โดยคงชื่อ Fastcare, React + TypeScript + Vite, ธีมขาวดำ/เทา, ฟอนต์ Inter ในเครื่อง และ UI ภาษาอังกฤษ ใช้ข้อมูลจำลองชุดเดียวกันทั้งระบบ วันที่อ้างอิงคงที่ **15 November 2026**

## Mobile-first ทั้งเว็บ — 16 November 2026

ปรับเลย์เอาต์มือถือถึง 900px รวมแนวนอน เมนูล่างคงที่ ปุ่มกด 44–50px ช่องกรอก 16px/คอลัมน์เดียว รายการเครื่องใช้แบบกระชับ ปุ่มจองคงที่เหนือเมนู และหน้าต่างรายละเอียดแบบ bottom sheet เพิ่มตัวเลือกโหมดแบบกระชับ ตัวกรองสถานะแผนบนมือถือ และตัวกรองเครื่องในหน้าบำรุงรักษา เสียง/วิดีโอจำลองใช้หน้าสนทนาเต็มจอ พร้อม Details และปุ่มควบคุมที่อยู่ในจอ

ผลตรวจล่าสุด: 138 layouts (23 หน้า/สถานะ × 6 ขนาดจอ) ไม่พบเนื้อหาล้นด้านข้างหรือ runtime errors, service flows 40 จุด, usability 34 จุด, chat 29 จุด และ mobile-first 26 จุดผ่าน ผลอยู่ใน `output/playwright/mobile-first-*-result.json` และรูปใน `output/playwright/mobile-first/` การตรวจแป้นพิมพ์เป็น viewport จำลอง ยังไม่ได้ทดสอบบนโทรศัพท์จริง ฟีเจอร์เดิมและข้อมูลจำลองยังอยู่ครบ

## ปรับการใช้งานให้ง่ายขึ้น — 16 November 2026

อัปเดตแชตเพิ่มเติม: เมื่อเริ่ม Chat จะเปิดหน้าสนทนาเต็ม viewport ช่องพิมพ์และปุ่มส่งอยู่คงที่ เลื่อนเฉพาะประวัติข้อความ พร้อมเลื่อนไปข้อความล่าสุดอัตโนมัติ ปุ่ม + เปิดคำถามตัวอย่าง และ Details เปิดสรุป/รายละเอียดเครื่อง/จองตรวจ/จบแชตเป็น bottom sheet บนมือถือ ข้อความร่างยังอยู่หลังปิด Details รองรับ Enter เพื่อส่ง, Shift+Enter เพื่อขึ้นบรรทัด และไม่ส่งระหว่างยืนยันตัวอักษร IME

ผลตรวจแชต: 29 checks ผ่าน รวม 320px, 390px, Desktop 1280px และ viewport ที่ย่อเพื่อจำลองพื้นที่คีย์บอร์ด ผลบันทึก `output/playwright/chat-flow-result.json` พร้อม regression flows เดิม 40 จุดใน `chat-care-flow-result.json` การตรวจคีย์บอร์ดเป็นการจำลองขนาดด้วย browser ไม่ใช่การทดสอบบนมือถือจริง

- Home แสดงทางเข้าบริการหลัก งานที่ต้องติดตาม และนัดถัดไป โดยลดข้อความโปรโมตและปุ่มที่ซ้ำกัน
- เพิ่ม `/bookings` สำหรับรวมนัดหมาย พร้อมลิงก์ไปเลื่อน/ยกเลิกนัดเดิม
- มือถือมีเมนูลัด Home / Appliances / Book / Talk / Care โดย Care เปิดหน้าบำรุงรักษาโดยตรง เมนูมุมซ้ายบนเปิดได้ครบทุกหน้า รองรับ Escape และการควบคุม focus ด้วยคีย์บอร์ด
- My appliances ค้นหาได้ทันที กด Filters เพื่อเลือกห้อง แบรนด์ และสถานะ พร้อม Clear filters; ชื่อแบรนด์ยังแสดงบนรายการ
- My protection กดตัวเลขสรุปสถานะเพื่อกรองเครื่องที่ต้องต่ออายุหรือสถานะอื่นได้
- หน้าเครื่องและเคสมีปุ่มข้ามไปยังเอกสาร รูป แผน และการตรวจ โดยย้ายการนัดตรวจขึ้นด้านบนของเคส
- กิจกรรม ประวัติ และรูปเพิ่มเติมยังดูได้เมื่อเปิดรายละเอียด ตารางเทียบแผนบนมือถือเลื่อนด้านข้างได้
- ปรับขนาดปุ่ม ช่องกรอก ระยะห่าง แท็บ และชื่อหน้าให้สม่ำเสมอทุกบริการ โดยคงฟีเจอร์และข้อมูลเดิมทั้งหมด

ผลตรวจ: service flows เดิม 40 จุด และ usability flows ใหม่ 34 จุดผ่าน ตรวจ 23 หน้า/สถานะที่ Desktop 1600px และ Mobile 390px พร้อม 9 หน้าหลักที่ 320px และ 768px ไม่พบ runtime errors ในการทดสอบ ผลบันทึกอยู่ใน `output/playwright/simple-care-flow-result.json`, `simple-ux-flow-result.json` และ `simple-layout-result.json` การตรวจนี้เป็น browser testing ไม่ใช่ผลสัมภาษณ์ผู้ใช้

## เปิดทดลองในเครื่อง

จากโฟลเดอร์โปรเจกต์:

```powershell
npm.cmd install
npm.cmd run dev
```

เปิด [เว็บสำหรับทดลอง](http://127.0.0.1:5173/overview) หากมี dev server เปิดอยู่แล้ว ไม่ต้องเปิดซ้ำ

ตรวจ build และเปิด production preview แยกจากเว็บ Docker เดิม:

```powershell
npm.cmd run build -- --outDir output/fastcare-preview
npm.cmd run preview -- --outDir output/fastcare-preview
```

เปิด [Production preview](http://127.0.0.1:4173/overview) ลิงก์ localhost ใช้งานบนเครื่องนี้ ต่อมาผู้ใช้สั่งให้อัปเดตขึ้น Docker แล้วเมื่อ 15 November 2026: เวอร์ชันล่าสุดอยู่ที่ [Docker preview](http://127.0.0.1:8080/overview) และ [ลิงก์สำหรับส่งให้เพื่อน](https://dive-shadows-genealogy-stationery.trycloudflare.com/overview) โดย build เข้า `dist/` แล้ว

## หน้าใหม่และหน้าที่ปรับ

| เส้นทาง | สิ่งที่ทดลองได้ |
| --- | --- |
| `/protection` | เลือกเครื่อง เปรียบเทียบ 3 แผน ดูเงื่อนไขและเลือกแผนจำลอง |
| `/protection/my-plans` | ดูสถานะแผน วันเริ่ม/สิ้นสุด/ต่ออายุ และต่ออายุจำลอง |
| `/consultation` | เลือกเครื่อง หัวข้อ ทีมที่รองรับแบรนด์ และ Chat / Voice / Video simulation |
| `/consultation/urgent` | คำขอติดต่อกลับจำลองและส่งต่อจองตรวจหลังน้ำท่วม |
| `/maintenance` | ตารางบำรุงรักษา วันบริการล่าสุด/ครั้งถัดไป ประวัติและ reminder |
| `/maintenance?tab=packages` | รายละเอียดและเลือกแพ็กเกจบำรุงรักษาจำลอง |
| `/maintenance?tab=repair` | แจ้งปัญหา ขอการตรวจ และเชื่อม Repair booking/progress |
| `/overview?mode=normal` | ทางเข้าบริการหลัก 3 ส่วน พร้อม maintenance และ plan renewal |
| `/overview?mode=flood` | ทางเข้าบริการหลักและ urgent support / moving / photos / damage |
| `/appliances` | Brand field ใน Add/Edit และค้นหา/กรองตามแบรนด์ |
| `/appliances/washer` | แยก Manufacturer Warranty จาก Protection Plan และภาพก่อนเหตุ |
| `/preparation` | Checklist และ progress เดิม พร้อมแท็บใหม่ |
| `/preparation?view=moving` | จัดลำดับ Priority บันทึกโน้ต ความต้องการผู้ช่วย และแผนเคลื่อนย้าย |
| `/preparation?view=photos` | บันทึกภาพก่อนเกิดเหตุในเครื่อง |
| `/bookings/new` | จอง Inspection / Maintenance / Repair และกรองทีมตามแบรนด์ |
| `/bookings/:id` | รายละเอียด เลื่อน/ยกเลิก และเชื่อมปัญหาที่แจ้งไว้ |
| `/recovery/new` | บันทึกความเสียหายพร้อมภาพหลังเหตุและวันที่เกิดเหตุ |
| `/recovery/RC-2026-001` | ภาพก่อน/หลัง แผนที่เกี่ยวข้อง การจองตรวจ และชุดเอกสาร |
| `/documents` | เอกสารที่เชื่อมกับเครื่องและสถานะ Not added / Draft / Ready for review |

## ลำดับทดลองแนะนำ

1. เข้า **Protection Plans** เลือกเครื่อง เปรียบเทียบแผน เปิดรายละเอียด แล้วกด **Select demo plan** อ่านสรุปและยืนยัน หลังบันทึกให้ดูใน **My protection**
2. ที่ My protection ทดลอง **Renew demo plan** ของ Refrigerator วันรอบถัดไปจะเปลี่ยนเป็น 1 Dec 2026–30 Nov 2027 โดยยังเก็บรอบเดิมไว้ สถานะรอบใหม่เป็น Scheduled และ Dashboard ไม่แสดงเตือนต่ออายุเดิมซ้ำ
3. เข้า **Consult a Technician** เลือกเครื่อง/หัวข้อ/ทีม ส่งข้อความใน Chat หรือเริ่ม Voice / Video จำลอง ทดลองปุ่มควบคุมและจบสาย เปิด Summary แล้วเลือก **Book inspection** เครื่องและบริการจะติดไปหน้าจอง
4. เข้า **Maintenance** ทดลอง reminder, เลือก demo package หรือไปแท็บ Repair แจ้งปัญหาและจอง Repair service การยกเลิกจองจะคืนสถานะปัญหาให้ขอตรวจใหม่ได้
5. เปลี่ยน **Flood Mode** แล้วเข้า **Moving priorities** ปรับ High / Medium / Low และปุ่มขึ้นลง จากนั้น Save moving plan จะเสร็จเฉพาะงานวางแผนเคลื่อนย้าย ไม่ทำให้ checklist ทั้งหมดเสร็จเอง
6. ที่ Appliance details หรือ Pre-flood photos เลือก **Add local photo** ใส่วันที่/คำอธิบาย ภาพแสดงเฉพาะในเครื่อง และเชื่อมกับ Recovery ของเครื่องเดียวกันเมื่อวันที่เหมาะสม
7. เปิด **Urgent technician support** เลือกข้อมูลแล้ว Request demo callback จะมีบันทึกและ Activity ในเครื่อง หรือ Schedule inspection เพื่อส่งต่อหน้าจอง
8. เปิด Recovery case ดูภาพก่อน/หลัง เพิ่ม supporting documents แล้ว Preview document pack เมื่อเอกสารครบจึง **Mark demo pack as ready** ได้ การกดนี้ไม่อนุมัติเคลมและไม่เปลี่ยนสถานะตรวจเป็นเสร็จแล้ว
9. ใช้ **Reset demo** และยืนยัน หรือ Settings → Reset demo data เพื่อคืนข้อมูลทุกส่วนและล้างภาพในเครื่อง หากเปิด Capture mode ให้ใช้ Settings หรือเอา `capture=1` ออกก่อน

## ภาพสำหรับสไลด์และ Direct URLs

Desktop เป็น PNG จาก browser ที่ 1600 × 900 ภาพ Mobile เป็น full-page ที่ viewport 390 × 844 ทั้งหมดใช้ข้อมูลเริ่มต้น หน้าเนื้อหายาวเลื่อนต่อได้ ภาพเดิม 01–06 ยังอยู่

| หน้า | Direct capture URL | Desktop PNG |
| --- | --- | --- |
| Protection comparison | [เปิดหน้า](http://127.0.0.1:4173/protection?compare=1&capture=1) | [08-protection-comparison.png](screenshots/08-protection-comparison.png) |
| My protection / renewal | [เปิดหน้า](http://127.0.0.1:4173/protection/my-plans?capture=1) | [09-my-protection-renewal.png](screenshots/09-my-protection-renewal.png) |
| Consultation channels | [เปิดหน้า](http://127.0.0.1:4173/consultation?capture=1) | [10-online-consultation.png](screenshots/10-online-consultation.png) |
| Simulated video | [เปิดหน้า](http://127.0.0.1:4173/consultation?preview=video&appliance=washer&capture=1) | [11-simulated-video-consultation.png](screenshots/11-simulated-video-consultation.png) |
| Moving priorities | [เปิดหน้า](http://127.0.0.1:4173/preparation?view=moving&mode=flood&capture=1) | [12-moving-priorities.png](screenshots/12-moving-priorities.png) |
| Urgent support | [เปิดหน้า](http://127.0.0.1:4173/consultation/urgent?mode=flood&capture=1) | [13-urgent-technician-support.png](screenshots/13-urgent-technician-support.png) |
| Maintenance packages | [เปิดหน้า](http://127.0.0.1:4173/maintenance?tab=packages&capture=1) | [14-maintenance-packages.png](screenshots/14-maintenance-packages.png) |
| Recovery + protection | [เปิดหน้า](http://127.0.0.1:4173/recovery/RC-2026-001?mode=flood&capture=1) | [15-recovery-protection.png](screenshots/15-recovery-protection.png) |
| Updated Normal dashboard | [เปิดหน้า](http://127.0.0.1:4173/overview?mode=normal&capture=1) | [16-dashboard-normal-updated.png](screenshots/16-dashboard-normal-updated.png) |
| Updated Flood dashboard | [เปิดหน้า](http://127.0.0.1:4173/overview?mode=flood&capture=1) | [17-dashboard-flood-updated.png](screenshots/17-dashboard-flood-updated.png) |

ภาพมือถือ 19 หน้าอยู่ใน [output/playwright/care-mobile](output/playwright/care-mobile/) และรวมกับ Desktop ใน [Fastcare-upgraded-services-screenshots.zip](Fastcare-upgraded-services-screenshots.zip)

ก่อนแคปจากลิงก์เอง แนะนำ Reset demo และตั้ง viewport 1600 × 900; `capture=1` ปิด animation/toast และคงข้อความ Interactive prototype · Sample data โดย video timer ใช้เวลาจำลองคงที่ รอ fonts พร้อมก่อนถ่าย

## Checklist ตามข้อกำหนด

Core services:

- [x] เลือก/เปรียบเทียบแผนคุ้มครองจำลอง พร้อม terms, eligibility และการยืนยัน
- [x] Chat ส่งข้อความและตอบจากข้อความที่กำหนดไว้
- [x] Voice call simulation พร้อม timer/mute/speaker/summary
- [x] Video simulation พร้อมกล้อง/ไมโครโฟนจำลองและ summary
- [x] จองตรวจ บำรุงรักษา และซ่อม

Normal Mode:

- [x] Technician booking
- [x] Online consultation
- [x] Appliance repair และ progress ที่เชื่อมการจอง
- [x] Preventive maintenance
- [x] Maintenance reminders
- [x] Manufacturer warranty tracking แยกจากแผน
- [x] Appliance records หลายแบรนด์
- [x] Protection plan renewal และข้อมูล Dashboard ที่อัปเดตตาม state

Flood Mode:

- [x] Flood preparation checklist
- [x] Prioritize appliances to move
- [x] Pre-flood photos และเชื่อมภาพหลังเหตุ
- [x] Urgent technician contact แบบจำลอง
- [x] Damage recording
- [x] Repair / inspection support
- [x] Insurance / claim document preparation support โดยไม่อนุมัติสิทธิ

Product scope:

- [x] หลายแบรนด์ มี Brand field/filter และตัวอย่างทีม/แผนที่รองรับต่างกัน
- [x] เชื่อม Protection + Technician + Maintenance + Recovery ด้วย Appliance ID
- [x] สาธิตได้ทั้ง Normal และ Flood Mode
- [x] Sample providers / illustrative terms ไม่มีคำอ้างพันธมิตรจริง
- [x] Frontend เท่านั้น ไม่มี backend/auth/database/external service integration
- [x] Responsive, Capture mode และ Reset demo ครอบคลุม state ใหม่
- [x] ภาพไม่ถูกส่งออกภายนอกและ object URLs ถูกคืนเมื่อ Reset
- [x] ไม่เพิ่ม Real-time flood alert / IoT / flood barriers

## ผลตรวจและข้อจำกัดที่เหลือจริง

- TypeScript และ production build ผ่าน (`output/fastcare-preview/`)
- Production preview เปิด/refresh direct routes สำหรับภาพใหม่ทั้ง 8 หน้าได้ และตรวจ summary ของแผนครบทั้ง 6 เครื่องโดยไม่พบ runtime errors: [production-care-smoke-result.txt](output/playwright/production-care-smoke-result.txt)
- Browser flow assertions ผ่าน 40 จุด รายละเอียดใน [care-flow-result.txt](output/playwright/care-flow-result.txt): migration ข้อมูลเก่า, eligibility, renew/refresh, consultation handoff, กล้อง/ไมค์ไม่ถูกเรียกใช้, callback, moving progress, photos, documents, recovery, packages, repair/cancel และ Reset
- ตรวจภาพ 10 หน้า Desktop และ 19 หน้า Mobile: ความกว้างเอกสารพอดี viewport ไม่มีการล้นแนวนอนทั้งหน้า และไม่พบ JavaScript runtime errors ระหว่างการตรวจ รายละเอียดใน [care-capture-result.txt](output/playwright/care-capture-result.txt)
- ทดสอบ Mobile ด้วย browser viewport ไม่ใช่เครื่องมือถือจริง
- ทั้งระบบเป็น interactive prototype: ไม่ซื้อประกัน/ต่ออายุกรมธรรม์จริง ไม่ชำระเงิน ไม่โทรหรือเชื่อมช่างจริง และไม่ส่งการจอง/คำขอ callback ออกไป
- แผน ราคา เงื่อนไข แบรนด์ ทีม และความพร้อมให้บริการเป็นตัวอย่าง การเตรียมเอกสารไม่ได้ยืนยันความคุ้มครองหรือผลเคลม
- Text state เก็บใน localStorage เฉพาะ browser นี้ ภาพที่เลือกเป็น preview ใน memory และหายเมื่อ refresh/ปิดหน้า/Reset; ไม่ได้สร้างระบบจัดเก็บภาพถาวร
- Reminder เป็นตัวเลือกและข้อมูลบนหน้าเว็บ ไม่มี push/email/background notification
- การติดตามงานซ่อมเป็นสถานะของ demo booking ไม่มีผลตรวจหรือรายงานช่างจริง
- อัปเดตขึ้น Docker/Cloudflare ตามคำสั่งผู้ใช้แล้วเมื่อ 15 November 2026 ต้องเปิดเครื่อง อินเทอร์เน็ต และ Docker Desktop ไว้ระหว่างให้เพื่อนทดลอง Quick Tunnel อาจเปลี่ยนลิงก์เมื่อสร้าง tunnel ใหม่

