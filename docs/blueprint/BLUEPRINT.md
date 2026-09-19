# ReadSkills BRU — Official Website Blueprint (Master Reference)

> **สถานะ:** เอกสารนี้คือแผนแม่บท (source of truth) สำหรับโครงสร้างเว็บไซต์ ReadSkills BRU ทั้งระบบ
> ครอบคลุมทั้ง 6 Unit / Lesson Plan (Unit 1–2 ทำเนื้อหาเสร็จแล้ว, Unit 3–6 ยัง Locked รอทำ)
> อ้างอิงจาก 3 ภาพ Infographic ที่ผู้ใช้ (เจ้าของโปรเจกต์) ส่งมาให้เมื่อ 2026-09-19
> ไฟล์ภาพต้นฉบับเก็บไว้ในโฟลเดอร์นี้: `01-web-structure-blueprint.png`, `02-internal-content-scope-activity-map.png`, `03-screen-flow-mockup.png`
>
> **กฎสำคัญ:** งานพัฒนาเว็บไซต์นี้ทุกครั้งต่อจากนี้ ต้องยึดตามแผนในเอกสารนี้เป็นหลัก เพื่อลดความผิดพลาดและความไม่สอดคล้องกันระหว่างรอบการทำงาน (session) ต่าง ๆ

---

## 1. หลักการที่สำคัญที่สุด

**หนึ่ง Lesson Plan = สองโมดูลเว็บ (Reading Lessons + Reading Strategies)**

- **Reading Lessons (บทเรียนการอ่าน):** ให้นักเรียน "ประยุกต์ใช้" ทักษะการอ่าน ผ่านลำดับ Pre-Reading → While-Reading → Post-Reading เนื้อหาคือ: อ่านบทความจริง, ทำแบบฝึกหัด, ทำแบบทดสอบ
- **Reading Strategies (กลยุทธ์การอ่าน):** สอน "กลยุทธ์" อย่างชัดเจนแยกต่างหาก คือ อะไร ทำไมต้องใช้ เมื่อไหร่ใช้ อย่างไรใช้ พร้อมตัวอย่างและแบบฝึกหัด
- **ห้ามให้เนื้อหาของสองโมดูลนี้ซ้ำกัน** — Reading Lessons ไม่สอนทฤษฎีกลยุทธ์แบบเต็ม ๆ (หน้าที่นั้นเป็นของ Reading Strategies) และ Reading Strategies ไม่ทำหน้าที่แบบฝึกอ่านบทความยาว ๆ (หน้าที่นั้นเป็นของ Reading Lessons)
- ทุกเนื้อหาต้องสอดคล้องกับ Chapter 3 และแผนการสอนที่อนุมัติแล้ว (Lesson Plans 1–6) เท่านั้น ห้ามเพิ่มทักษะใหม่นอกขอบเขต

---

## 2. โครงสร้างเมนูหลักจาก Home

จากหน้า Home / Dashboard (แสดง overview, quick access, current lesson, recent activity, notifications) แตกออกเป็น 4 โมดูลหลัก:

| โมดูล | หน้าที่หลัก |
|---|---|
| 📖 **Reading Lessons** (บทเรียนการอ่าน) | บทเรียนการอ่านที่มีโครงสร้างชัดเจน ตาม Lesson Plans 1–6 |
| 🧭 **Reading Strategies** (กลยุทธ์การอ่าน) | เรียนรู้และฝึกใช้กลยุทธ์การอ่าน พร้อมตัวอย่างและแบบฝึกหัด |
| 🕹️ **Practice & Quiz** (แบบฝึกหัดและแบบทดสอบ) | แบบฝึกหัดเชิงโต้ตอบ เกม และแบบทดสอบ |
| 📊 **Learning Progress** (ความก้าวหน้าในการเรียน) | ติดตามกิจกรรมและความก้าวหน้าในการเรียน |

---

## 3. โครงสร้าง Reading Lessons (6 Unit ตาม Lesson Plan 1–6)

### 3.1 โครงสร้างภายในแต่ละ Unit (Lesson Flow)

```
Unit Page (ภาพรวมหน่วย, วัตถุประสงค์, รายการหัวข้อ)
   ↓
Stage Tabs: Pre-Reading | While-Reading | Post-Reading  (3 ช่วงการสอน)
   ↓
Topic Cards (หัวข้อย่อยภายในแต่ละช่วง)
   ↓
Activity Steps: Overview → Learn → Example → Practice → Quiz/Review
```

Reading Lessons แต่ละหน่วยประกอบด้วยองค์ประกอบเหล่านี้: Unit Overview, Vocabulary Support, Reading Passages, Guided Activities, Exercises, Quiz/Self-Check, Review/Reflection, Post-Test (เฉพาะเมื่อจำเป็น)

### 3.2 ขอบเขตเนื้อหารายหน่วย (Unit-by-Unit Content Scope)

| Unit | ชื่อหน่วย | ขอบเขตเนื้อหา |
|---|---|---|
| 1 | **Main Ideas** (ใจความสำคัญ) | Text features, vocabulary preview, topic sentence, main idea, reading passages, post-reading self-check |
| 2 | **Supporting Details & Idea Relationships** (รายละเอียดสนับสนุนและความสัมพันธ์ของใจความ) | Major/minor details, cause and effect, compare and contrast, sequence, guided reading, review |
| 3 | **Vocabulary in Context & Sentence Meaning** (คำศัพท์ในบริบทและความหมายของประโยค) | Word meaning from context, sentence meaning, vocabulary practice, reading application |
| 4 | **References, Connectives & Text Organization** (คำอ้างอิง คำเชื่อม และโครงสร้างข้อความ) | Reference words, connectives, paragraph organization, text structure practice |
| 5 | **Text Interpretation & Paraphrased Meaning** (การตีความและความหมายที่เรียบเรียงใหม่) | Interpretation, paraphrased meaning, understanding meaning across sentences, guided practice |
| 6 | **Integrated Reading Practice** (การฝึกอ่านแบบบูรณาการ) | Integrated reading passages, review of multiple skills, overall reading practice, progress check |

> **หมายเหตุ:** Unit 1 และ 2 ทำเนื้อหาเต็มรูปแบบแล้วในเว็บไซต์ปัจจุบัน ส่วน Unit 3–6 มีแค่การ์ด "Locked" วางโครงชื่อหน่วย/แท็กไว้ล่วงหน้าตาม Blueprint นี้แล้ว (ตรวจสอบแล้วว่าชื่อหน่วยและแท็กในโค้ดตรงกับตารางนี้ทุกตัวอักษร) รอเนื้อหาจริงเข้าไปเติมตามคิว

---

## 4. โครงสร้าง Reading Strategies (6 Unit ตาม Lesson Plan 1–6)

### 4.1 ลำดับการสอนกลยุทธ์ (Strategy Learning Sequence) — ใช้เหมือนกันทุก Unit

```
1. What is the strategy?     → นิยามที่เข้าใจง่าย
2. Why use it?                → ประโยชน์และเมื่อไหร่ที่มันช่วยได้
3. When do I use it?          → สถานการณ์ที่เหมาะสม
4. How do I use it?           → ขั้นตอนทีละขั้น
5. Worked Example             → ตัวอย่างพร้อมคำอธิบายประกอบ
6. Guided Practice            → ฝึกโดยมีตัวช่วย
7. Apply to a Short Text      → ใช้กลยุทธ์ด้วยตัวเองกับข้อความสั้น ๆ
8. Strategy Quiz              → แบบทดสอบเช็คความเข้าใจ
```

### 4.2 กลยุทธ์รายหน่วย (Unit-by-Unit Strategy Scope)

| Unit | ชื่อกลยุทธ์ | รายละเอียด |
|---|---|---|
| 1 | **Previewing & Predicting** | การคาดเดาเนื้อหาและอ่านล่วงหน้า, ใช้ text features ในการคาดเดา |
| 2 | **Skimming & Scanning** | Skimming เพื่อหาใจความสำคัญ, Scanning เพื่อหาข้อมูลเฉพาะจุด |
| 3 | **Using Context Clues** | ใช้คำใบ้จากบริบทเพื่อหาความหมายคำศัพท์และประโยค |
| 4 | **Identifying Text Organization** | ระบุโครงสร้างข้อความ คำอ้างอิง คำเชื่อม และการจัดระเบียบ |
| 5 | **Making Inferences** | การอนุมานความหมาย, อ่านระหว่างบรรทัด |
| 6 | **Integrated Strategy Review** | นำกลยุทธ์หลาย ๆ อย่างมาใช้ร่วมกัน |

> **หมายเหตุ:** Unit 1 (Previewing & Predicting) และ Unit 2 (Skimming & Scanning) ทำเสร็จแล้วในเว็บไซต์ปัจจุบัน ตรงกับชื่อในตารางนี้เป๊ะ

---

## 5. Practice & Quiz Module

### 5.1 ประเภทของ Practice Options
- **Games** — เกมโต้ตอบสนุก ๆ เพื่อเสริมทักษะ
- **Quizzes** — แบบทดสอบรายหน่วยและแบบผสม
- **Reading Passage Practice** — บทความจริงพร้อมคำถามความเข้าใจ
- **Immediate Feedback** — ผลลัพธ์และคำอธิบายทันที

### 5.2 ประเภทกิจกรรมฝึกหัด/แบบทดสอบ (Content Types)
- Short reading quizzes (แบบทดสอบสั้น)
- Passage-based comprehension questions (คำถามจากบทความ)
- Matching tasks (แบบจับคู่)
- Drag-and-drop or ordering tasks (แบบลากวางหรือเรียงลำดับ)
- Quick review games (เกมทบทวนความรู้)
- Immediate feedback (ผลตอบรับทันที)

### 5.3 เกมและแบบทดสอบที่แนะนำ รายหน่วย (Suggested Games & Quizzes)

| Unit | เกม/แบบทดสอบที่แนะนำ |
|---|---|
| 1 | Vocabulary Preview · Prediction Quiz · Main Idea Match |
| 2 | Main Idea Challenge · Timed Scanning Task · Detail Hunt |
| 3 | Context Clue Game · Vocabulary Quiz · Sentence Meaning Match |
| 4 | Reference Matching Task · Text Structure Practice · Connective Link Game |
| 5 | Inference Detective · Paraphrasing Practice · Meaning Builder Quiz |
| 6 | Integrated Reading Challenge · Progress Check · Reading Review Quiz |

> **หมายเหตุ:** ชื่อเกมของ Unit 3–6 เหล่านี้ ("Context Clue Game", "Reference Matching", "Inference Detective", "Reading Challenge" ฯลฯ) ปรากฏอยู่แล้วเป็นแท็กในการ์ด "Locked" ของแต่ละ Unit ในหน้า Reading Lessons ปัจจุบัน — ยืนยันว่า Blueprint นี้คือแผนต้นฉบับที่ใช้วางโครงไว้ล่วงหน้าจริง

---

## 6. Learning Progress Module — สิ่งที่ต้องติดตาม (What We Track)

- **Completed Lessons** — หน่วยและช่วงการสอนที่จบแล้ว
- **Completed Activities** — ความคืบหน้าระดับ Activity
- **Quiz Scores** — คะแนนและผลงานรายหน่วย
- **Time on Task** — เวลาที่ใช้ในการเรียน
- **Frequency of Access** — ความถี่ในการเข้าใช้แอป
- **Overall Progress** — สรุปความก้าวหน้าแบบภาพรวม (progress bar, กราฟ)

---

## 7. หน้าจอตัวอย่าง (Screen Flow Mockup) — ลำดับการใช้งานจริง

1. **Home Dashboard** — ทักทาย, การ์ด "Current Active Lesson", grid 4 โมดูลหลัก
2. **Reading Lessons – Unit Hub** — การ์ด Unit พร้อม % ความคืบหน้า, Tab Pre/While/Post-Reading, รายการ Topic (มีเครื่องหมายถูกสำหรับ Topic ที่จบแล้ว)
3. **Topic Learning Screen** — Breadcrumb (Unit > Stage > Topic), Tab ช่วงการสอน, Tab ย่อยระดับ Activity: **Overview → Learn → Example → Practice → Quick Check**, กล่อง Learning Goal, ปุ่ม Previous/Next
4. **Reading Strategies Screen** — การ์ดกลยุทธ์ พร้อมมินิการ์ด 4 ใบ (What?/Why?/When?/How?), Worked Example, Guided Practice, ลิงก์ไป Strategy Quiz
5. **Practice & Quiz / Learning Progress** (รวมในหน้าเดียวกันได้) — การ์ด Reading Practice, การ์ด Game & Quiz, สรุป My Learning Progress (% รวม, จำนวน Unit/Topic/Quiz ที่ทำ), Achievements

---

## 8. ธีมและแนวทาง UI/UX

- โทนสี: ม่วงพาสเทล (pastel purple / lavender), ชมพูอ่อน (soft pink), พื้นหลังหิมะตก (snowfall background effect)
- อินเทอร์เฟซทันสมัยแต่เรียบง่าย (modern but simple)
- ระดับภาษา: A1–B2 โดยรวม เนื้อหาบทเรียนส่วนใหญ่อยู่ระดับ A2–B1 มีคำอธิบายภาษาไทยประกอบจุดที่ยาก (Thai support for difficult points)
- ต้อง Responsive ทั้ง Desktop / Tablet / Mobile
- โครงสร้างต้อง Clean & Scalable — ดูแลรักษาและขยายเพิ่มเติมได้ง่าย
- User-Friendly — นำทางและป้ายชื่อชัดเจน

**หมายเหตุถึงนักพัฒนา (จากต้นฉบับ Blueprint โดยตรง):** ผู้พัฒนาควรรักษาอัตลักษณ์สีม่วงที่ใช้อยู่ปัจจุบันไว้, ทำให้อินเทอร์เฟซนำทางง่าย, และจัดโครงสร้างเนื้อหาให้ชัดเจนภายในแต่ละหัวข้อ

---

## 9. สถานะปัจจุบันเทียบกับ Blueprint (ณ วันที่บันทึกเอกสารนี้)

| รายการ | สถานะ |
|---|---|
| Reading Lessons Unit 1 (Main Ideas) | ✅ เสร็จสมบูรณ์ |
| Reading Lessons Unit 2 (Supporting Details) | ✅ เสร็จสมบูรณ์ |
| Reading Lessons Unit 3–6 | 🔒 Locked — มีแค่การ์ดชื่อหน่วย/แท็กตาม Blueprint รอเนื้อหาจริง |
| Reading Strategies Unit 1 (Previewing & Predicting) | ✅ เสร็จสมบูรณ์ (รวม T-V-F-K, Prediction Quiz, Integrated Strategies Quiz) |
| Reading Strategies Unit 2 (Skimming & Scanning) | ✅ เสร็จสมบูรณ์ |
| Reading Strategies Unit 3–6 | 🔒 ยังไม่ได้เริ่ม |
| Practice & Quiz module | มีอยู่ในเมนู แต่ยังไม่ได้ตรวจสอบขอบเขตเทียบกับ Blueprint นี้อย่างละเอียด |
| Learning Progress module | มีอยู่ในเมนู แต่ยังไม่ได้ตรวจสอบขอบเขตเทียบกับ Blueprint นี้อย่างละเอียด |

---

## 10. กฎการทำงานต่อจากนี้ (เพื่อลดความผิดพลาด)

1. ก่อนเพิ่มเนื้อหาใหม่ให้ Unit ไหนก็ตาม ให้เปิดเอกสารนี้เช็คขอบเขตของ Unit นั้นก่อนเสมอ (ตาราง §3.2 และ §4.2)
2. ห้ามให้ Reading Lessons กับ Reading Strategies ของ Unit เดียวกันมีเนื้อหาซ้ำกัน — ตรวจสอบด้วย text-diff ทุกครั้งที่เพิ่มเนื้อหาใหม่ (ทำแบบนี้มาแล้วและควรทำต่อไปเป็นมาตรฐาน)
3. เมื่อเริ่มทำ Unit 3–6 ให้ใช้ชื่อกลยุทธ์และชื่อเกมตามตาราง §3.2, §4.2, §5.3 เป๊ะ ๆ (ชื่อเหล่านี้ถูกฝังไว้ในโค้ด hub-card ของ Unit ที่ Locked อยู่แล้ว)
4. ทุกครั้งที่เพิ่ม/แก้ Activity ใหม่ในระบบ Topic→Activity ให้ตรวจสอบโครงสร้าง `<div>` ปิด-เปิดให้ถูกต้อง (ดู bug class ที่เจอและแก้ไปแล้วใน update35, update36 — การปิด div ผิดที่ทำให้เกิดทั้งเนื้อหาซ้อนและหน้าจอว่างเปล่า)
5. รักษาธีมสีม่วงพาสเทล/ชมพูอ่อน และโครงสร้าง Stage Tab (Pre/While/Post-Reading) ไว้เป็นมาตรฐานเดียวกันทุก Unit
