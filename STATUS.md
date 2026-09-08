# ReadSkills BRU — Project Status

**บทบาท:** Senior Full Stack Developer
**โปรเจกต์:** เว็บแอปฝึกทักษะการอ่านภาษาอังกฤษ (Single Page App) — ไม่มี backend/database จริง เป็น frontend prototype

---

## 📌 อัปเดตล่าสุด (2026-09-08)

1. **ดีไซน์ Home + Sign-in ปรับเป็น "Direction A"** (จาก Design Canvas ที่นำเสนอไว้ก่อนหน้า):
   - Home: รวม greeting + avatar เป็นแถวเดียว, การ์ด "เรียนต่อ" (Continue) เป็นไล่สีกรมท่า-ทองพร้อมปุ่มเล่นวงกลม, 4 เมนูการ์ดเปลี่ยนจากลิสต์แนวตั้งเป็นกริดไอคอน 2 คอลัมน์ (ยุบเหลือ 1 คอลัมน์บนจอแคบ)
   - Sign-in: ไอคอน emoji → SVG, ปุ่มหลักเป็นไล่สีทอง, ชื่อมหาวิทยาลัยใต้โลโก้เป็น pill ทอง
   - Passage/exercise UI (`ex-opt`, letter badges) ตรงกับ mockup อยู่แล้วไม่ต้องแก้
   - ยังไม่ได้ทำ: Desktop side-nav layout (มีอยู่ใน mockup `DesktopHome.dc.html`) — ต้องปรับโครงสร้างทุกหน้าจอ ยังไม่ได้ลงมือเพราะเสี่ยงกระทบฟีเจอร์เดิม รอ confirm ก่อนเริ่ม

2. **Unit 1 เนื้อหาเขียนใหม่ทั้งหมดเป็นระดับ CEFR A2-B1** (ทั้ง Reading Lessons 8 topics และ Reading Strategies module) อ้างอิงจาก `1. AJ.Bow Lesson Plan Unit 1.docx` ของผู้สอน:
   - Topic 1–8 (`topic-pane-1` ถึง `topic-pane-8`) และ `#screen-strategy-detail` ปรับคำศัพท์/ประโยคให้ง่ายลงจาก B2+ เดิม (เช่น "controlling idea", "coral bleaching") โดยคงโครงสร้าง id/onclick/class เดิมทั้งหมด ไม่กระทบ app.js
   - เพิ่ม diagram/mind-map ใหม่ให้ Topic 2 (ตำแหน่ง Topic Sentence), Topic 3 (mind-map Topic→Main Idea→Details), Topic 5 (เปรียบเทียบ Main Idea vs Details) ที่เดิมไม่มีภาพประกอบ
   - Topic 7 (Passage A–F) และแบบฝึกหัดทั้งหมดปรับคำศัพท์ง่ายลงเช่นกัน โดยคำตอบที่ถูกต้องของแต่ละข้อไม่เปลี่ยน
   - Commit: `2f5c754` "Simplify Unit 1 content to CEFR A2-B1 level"

3. **แผนถัดไป (รอผู้ใช้):** ผู้ใช้แจ้งว่า Lesson Plan มีทั้งหมด 6 หน่วย (Unit 1–6) แต่ละหน่วยแบ่งเป็น 2 module (Reading Lesson + Reading Strategies) — ตอนนี้มีไฟล์ Lesson Plan ของ Unit 1 เท่านั้น เมื่อได้ไฟล์ Lesson Plan ของ Unit 2–6 จะทำเนื้อหาต่อในรูปแบบเดียวกัน (A2-B1, มี diagram/รูปภาพ, มีแบบฝึกหัด)

---

## โครงสร้างไฟล์ปัจจุบัน

โปรเจกต์ถูกแยกจากไฟล์ `index.html` เดี่ยว (8,672 บรรทัด) ออกเป็น 3 ไฟล์:

```
index.html   → โครงสร้างหน้า (HTML) + <link> ไป style.css + <script src> ไป app.js
              รูปภาพทั้งหมดฝังเป็น base64 อยู่ใน <img src="data:image/..."> แล้ว
style.css    → CSS ทั้งหมด (~3,725 บรรทัด)
app.js       → JavaScript ทั้งหมด (~790 บรรทัด) รวมระบบ Demo Sign-in
```

ไฟล์เสริม:
- `1. AJ.Bow Lesson Plan Unit 1.pdf` — แผนการสอนต้นฉบับ ใช้อ้างอิงตอนเขียนเนื้อหา
- `assets/images/passage1_sleep.jpg`, `passage2_gardens.jpg` — รูปต้นฉบับที่ใช้อยู่ (ถูกย่อขนาด + แปลง base64 ฝังใน index.html แล้ว ไม่ได้ลิงก์จากโฟลเดอร์นี้อีก)
- `assets/images/passage3_rainforest.jpg` — **ยังไม่ได้ใช้งาน** มีไฟล์รูปแต่ยังไม่มีเนื้อหา Passage คู่กัน
- `ReadSkills-BRU-Review.html` — ไฟล์ single-file (รวม CSS+JS+รูปทั้งหมด) generate จาก 3 ไฟล์หลัก ใช้ส่งให้คนอื่นรีวิวเท่านั้น ไม่ใช่ไฟล์ทำงานหลัก

## กติกาการทำงาน

- **ห้ามแก้ระบบ Demo Sign-in / localStorage** ตอนนี้ — ยังอยู่ขั้นพัฒนาเนื้อหา ผู้ใช้จะแจ้งเองเมื่อพร้อมทำ backend จริง
- ก่อนแก้ไฟล์ใหญ่ ให้ยืนยันแผนกับผู้ใช้ก่อนเสมอ
- โครงสร้างหน้า (Topic 1–8 ใน Unit 1) คือ:
  - Topic 1–6 = Pre-Reading (ทฤษฎี + ตัวอย่างสั้น ยังไม่มี Passage เต็มของตัวเอง)
  - Topic 7 = While-Reading (Passage A–E: สั้น/กลาง/ยาว)
  - Topic 8 = Post-Reading (Quiz 5 ข้อ + Rubric ประเมินตนเอง)

---

## ✅ สิ่งที่แก้ไปแล้ว

1. **แยกไฟล์** — CSS/JS ออกจาก HTML เรียบร้อย (index.html / style.css / app.js)
2. **แก้บั๊ก div ไม่ปิด (Critical)** — `topic-content-pane` ของ Topic 2, 3, 4, 5 ขาด `</div>` ไปข้อละ 1 อัน ทำให้ Topic 3–8 กลายเป็น descendant ซ้อนอยู่ใน Topic 2 ในโครงสร้าง DOM จริง เวลา JS สั่ง `display:none` ที่ Topic 2 จะลาก Topic 3–8 หายไปด้วย (หน้าจอว่างเปล่าเวลาคลิก Topic อื่นที่ไม่ใช่ 1 หรือ 2) — ตรวจสอบด้วยสคริปต์นับ div เปิด/ปิดทั้งไฟล์แล้วว่า **สมดุล 100%** (`opens - closes = 0`, stack depth จบที่ 0)
   > ⚠️ หมายเหตุ: มี implementation plan เก่าจากเครื่องมืออื่นที่วินิจฉัยบั๊กผิดจุด (อ้างว่ามี Passage Sleep/Gardens/Rainforest หลุดออกนอก topic-pane-7 ที่บรรทัด 7056–7253 และแนะนำให้ลบ) — ตรวจสอบแล้วว่า**ไม่จริง** บรรทัดนั้นคือเนื้อหา Passage E (Renewable Energy) ที่ถูกต้องอยู่แล้ว ถ้าทำตาม plan เก่าจะลบเนื้อหาจริงทิ้งโดยไม่จำเป็น
3. **แก้รูปภาพให้ตรงเนื้อหา:**
   - Passage C (Sleep and Academic Success) → ใช้ `passage1_sleep.jpg` (ของเดิมมี แต่ไม่เคยถูกเรียกใช้ ใช้ Unsplash แทน)
   - Passage D (Urban Community Gardens) → ใช้ `passage2_gardens.jpg`
4. **วาดภาพประกอบใหม่ (flat illustration style, โทนสี gold #e8c97a / teal #4ecdc4 / dark bg ให้เข้าธีมเว็บ)** สำหรับ Passage ที่ไม่มี asset ในเครื่อง:
   - Passage A — Phone & Focus (นักศึกษาก้มดูโทรศัพท์ หนังสือเปิดค้างไม่ได้อ่าน)
   - Passage B — Thai Street Food (รถเข็นอาหารริมทาง ก๋วยเตี๋ยว สะเต๊ะ)
   - Passage E — Renewable Energy (กังหันลม แผงโซลาร์เซลล์)
5. **ฝังรูปทั้งหมด 5 รูปเป็น base64** ตรงใน `index.html` แล้ว (ย่อขนาดไฟล์ต้นฉบับ C/D ลงก่อนฝัง เพื่อไม่ให้ไฟล์ใหญ่เกินไป) — ไม่พึ่ง external link (Unsplash) หรือ relative path ไปโฟลเดอร์ assets อีกต่อไป ทำให้ส่งไฟล์เดียวให้คนอื่นรีวิวได้เลย

---

## 🔲 สิ่งที่ยังไม่ได้ทำ (ค้างจาก requirement เดิมของผู้ใช้)

1. **เพิ่ม Passage/Story ใหม่ให้ Pre-Reading (Topic 1–6)** — แต่ละ Topic (Text Features, Topic Sentence, Main Idea, Supporting Details, Main Idea vs Details, Vocabulary) ควรมี short passage (~80–120 คำ) ที่สอดคล้องกับหัวข้อของตัวเอง พร้อมคำถามทบทวน — ตอนนี้มีแค่ทฤษฎี+ตัวอย่างสั้นเท่านั้น
2. **เขียน Passage ใหม่ให้ตรงกับ `passage3_rainforest.jpg`** — มีไฟล์รูป (นักวิจัยวิเคราะห์ข้อมูลดาวเทียมป่าฝนอเมซอน) แต่ยังไม่มีเนื้อหา Passage คู่กันเลย
3. **While-Reading (Topic 7) — เพิ่มความหลากหลาย** ให้บางเรื่องมีทั้งเวอร์ชัน Short และ Long คู่กัน (ตอนนี้มี 1 ระดับความยาวต่อ 1 เรื่อง)
4. **Post-Reading (Topic 8) — เพิ่มระบบคำนวณ/สรุปคะแนนจริง** ตอนนี้ `checkModularAnswer()` ให้แค่ feedback ทีละข้อ ไม่มีการรวมคะแนนท้าย quiz หรือบันทึกผลลง localStorage ควรเพิ่ม: คะแนนรวม, Self-Reflection Rating (1–5 ดาว), และอาจมี Badge/Certificate เมื่อผ่านเกณฑ์ ≥70%
5. **รีวิวภาษาไทย-อังกฤษให้เป็นธรรมชาติทั้งหมด** — ยังไม่ได้ไล่ทุกจุด โดยเฉพาะศัพท์เทคนิคที่ทับศัพท์ไม่มีคำอธิบายไทยกำกับ
6. **ทดสอบปุ่ม/interaction ทุกจุดแบบละเอียด** — ยังไม่ได้ไล่ทดสอบทีละปุ่มหลังแก้บั๊ก div (ควรทดสอบซ้ำอีกรอบว่าไม่มีจุดอื่นที่ตกหล่น)

---

## บั๊กอื่นที่ควรตรวจสอบเพิ่ม (จากการรีวิวโค้ดเบื้องต้น รอบก่อนแก้บั๊ก div)

- Inline `onclick` 329 จุด + inline `style=` 450 จุด — ผูก logic กับ HTML แน่นเกินไป ควรทยอยย้ายไป `addEventListener` และ CSS class
- ยังไม่มี state management ที่เป็นระบบ (ใช้ DOM manipulation ตรงๆ ทั้งหมด) — จะเริ่มจัดการยากขึ้นเมื่อเนื้อหาโตขึ้นตามข้อ 1–4 ด้านบน
