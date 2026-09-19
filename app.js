    // ═══════════ CONFIG ═══════════
    const ALLOWED_DOMAIN = null; // null = open, 'bru.ac.th' = restrict
    const DEMO_USERS = {
      'test@gmail.com': { name: 'Test User', given_name: 'Test', password: '123456', color: '#4285F4' }
    };
    const DEMO_DEFAULT_PASSWORD = '123456';

    // ═══════════ STATE ═══════════
    let currentUser = null, pendingEmail = '', pwdVisible = false;

    // ═══════════ INIT ═══════════
    window.addEventListener('load', () => {
      setTimeout(() => document.getElementById('loading-overlay').classList.add('hide'), 700);
      document.querySelectorAll('.signin-input').forEach(inp => {
        inp.addEventListener('focus', () => inp.closest('.input-group').classList.add('focused'));
        inp.addEventListener('blur', () => {
          inp.closest('.input-group').classList.remove('focused');
          inp.closest('.input-group').classList.toggle('has-value', !!inp.value);
        });
      });
      const stored = sessionStorage.getItem('rs_user');
      if (stored) { try { loginSuccess(JSON.parse(stored), false); } catch (e) { sessionStorage.removeItem('rs_user'); } }
    });

    // ═══════════ SIGN-IN ═══════════
    function onEmailInput() {
      const v = document.getElementById('input-email').value;
      document.getElementById('grp-email').classList.toggle('has-value', v.length > 0);
      clearErr('signin-error-email');
      document.getElementById('input-email').classList.remove('error-field');
    }
    function onPasswordInput() {
      const v = document.getElementById('input-password').value;
      document.getElementById('grp-password').classList.toggle('has-value', v.length > 0);
      clearErr('signin-error-pwd');
      document.getElementById('input-password').classList.remove('error-field');
    }

    function nextToPassword() {
      let email = document.getElementById('input-email').value.trim().toLowerCase();
      if (!email.includes('@') && ALLOWED_DOMAIN) email += '@' + ALLOWED_DOMAIN;
      const domain = email.split('@')[1] || '';
      if (!email || !email.includes('@') || !domain) {
        showErr('signin-error-email', 'Please enter a valid email address');
        document.getElementById('input-email').classList.add('error-field');
        shakify('grp-email'); return;
      }
      if (ALLOWED_DOMAIN && domain !== ALLOWED_DOMAIN) {
        showErr('signin-error-email', `This account is not from @${ALLOWED_DOMAIN}. Use your university email.`);
        document.getElementById('input-email').classList.add('error-field');
        shakify('grp-email'); return;
      }
      spinBtn('btn-next-email-txt', 'spin-email', true);
      setTimeout(() => {
        spinBtn('btn-next-email-txt', 'spin-email', false);
        pendingEmail = email;
        document.getElementById('chip-email-text').textContent = email;
        const chip = document.getElementById('chip-avatar');
        chip.textContent = email[0].toUpperCase(); chip.style.background = '#4285F4';
        goStep('step-email', 'step-password');
        setTimeout(() => document.getElementById('input-password').focus(), 350);
      }, 700);
    }

    function submitSignIn() {
      const pwd = document.getElementById('input-password').value;
      if (!pwd) { showErr('signin-error-pwd', 'Enter your password'); document.getElementById('input-password').classList.add('error-field'); return; }
      spinBtn('btn-signin-txt', 'spin-pwd', true);
      setTimeout(() => {
        spinBtn('btn-signin-txt', 'spin-pwd', false);
        const known = DEMO_USERS[pendingEmail];
        if (pwd !== (known ? known.password : DEMO_DEFAULT_PASSWORD)) {
          showErr('signin-error-pwd', 'Wrong password. (Demo: 123456)');
          document.getElementById('input-password').classList.add('error-field');
          document.getElementById('input-password').value = '';
          document.getElementById('grp-password').classList.remove('has-value');
          shakify('grp-password'); return;
        }
        const user = known ? { ...known, email: pendingEmail } : { name: pendingEmail.split('@')[0], given_name: pendingEmail.split('@')[0], email: pendingEmail, color: '#4285F4' };
        document.getElementById('success-name-msg').textContent = `Welcome, ${user.given_name}!`;
        goStep('step-password', 'step-success');
        setTimeout(() => { sessionStorage.setItem('rs_user', JSON.stringify(user)); loginSuccess(user, true); }, 1100);
      }, 900);
    }

    function backToEmail() {
      document.getElementById('input-password').value = '';
      document.getElementById('grp-password').classList.remove('has-value');
      clearErr('signin-error-pwd');
      const active = document.querySelector('.signin-step.active');
      if (active) active.classList.remove('active');
      document.getElementById('step-email').classList.add('active');
      setTimeout(() => document.getElementById('input-email').focus(), 300);
    }
    function showForgot() {
      const active = document.querySelector('.signin-step.active');
      if (active) active.classList.remove('active');
      document.getElementById('step-forgot').classList.add('active');
    }
    function goStep(a, b) { document.getElementById(a).classList.remove('active'); document.getElementById(b).classList.add('active'); }
    function togglePwd() {
      pwdVisible = !pwdVisible;
      document.getElementById('input-password').type = pwdVisible ? 'text' : 'password';
      document.getElementById('eye-btn').textContent = pwdVisible ? '🙈' : '👁';
    }
    function spinBtn(t, s, on) { document.getElementById(t).style.display = on ? 'none' : 'inline'; document.getElementById(s).classList.toggle('show', on); }
    function shakify(id) {
      const el = document.getElementById(id); let i = 0;
      const steps = [8, -8, 6, -6, 4, -4, 2, -2, 0];
      const next = () => { if (i >= steps.length) { el.style.transform = ''; return; } el.style.transform = `translateX(${steps[i++]}px)`; setTimeout(next, 40); };
      next();
    }
    function showErr(id, msg) { const e = document.getElementById(id); if (e) { e.textContent = msg; e.classList.add('show'); } }
    function clearErr(id) { const e = document.getElementById(id); if (e) { e.textContent = ''; e.classList.remove('show'); } }

    // ═══════════ DEMO QUICK SIGN-IN (TESTING PHASE) ═══════════
    function demoQuickSignIn() {
      const demoUser = {
        name: 'Demo Student',
        given_name: 'Demo Student',
        email: 'demo.student@bru.ac.th',
        color: '#e8c97a'
      };
      // Preset default test profile if not exists
      if (!getProfile(demoUser.email)) {
        saveProfile(demoUser.email, {
          fullname: 'Demo Student (นักศึกษาทดสอบ)',
          studentId: '6711990001',
          section: '1',
          faculty: 'คณะครุศาสตร์ (Faculty of Education)',
          year: '2',
          email: demoUser.email,
          updatedAt: new Date().toISOString()
        });
      }
      const active = document.querySelector('.signin-step.active');
      if (active) active.classList.remove('active');
      document.getElementById('success-name-msg').textContent = 'Welcome, Demo Tester!';
      document.getElementById('step-success').classList.add('active');

      setTimeout(() => {
        sessionStorage.setItem('rs_user', JSON.stringify(demoUser));
        loginSuccess(demoUser, true);
        showToast('🚀 เข้าสู่ระบบในโหมด Demo สำเร็จ!');
      }, 700);
    }

    // ═══════════ LOGIN SUCCESS ═══════════
    function loginSuccess(user, animate) {
      currentUser = user;
      const profile = getProfile(user.email);
      const displayName = profile ? profile.fullname : (user.given_name || user.name);
      const initial = displayName[0].toUpperCase();

      // Top bar
      document.getElementById('tb-avatar').textContent = initial;
      document.getElementById('tb-avatar').style.background = user.color || 'var(--gold)';
      document.getElementById('tb-name').textContent = displayName;
      document.getElementById('tb-meta').textContent = profile ? `${profile.studentId} · Sec.${profile.section}` : user.email;
      document.getElementById('top-bar').classList.add('show');
      document.body.classList.add('logged-in');
      document.getElementById('bnav').classList.add('show');

      // Greeting
      document.getElementById('greeting-name').textContent = displayName.split(' ')[0];

      // Profile card
      renderProfileCard(profile);

      if (animate) {
        if (!profile) { showToast('Welcome! Please complete your profile 📝'); setTimeout(() => openProfileModal(false), 1200); }
        else showToast(`Welcome back, ${displayName.split(' ')[0]}! 👋`);
      }
      nav('screen-home');
    }

    function signOut() {
      sessionStorage.removeItem('rs_user');
      currentUser = null;
      document.getElementById('top-bar').classList.remove('show');
      document.getElementById('bnav').classList.remove('show');
      document.body.classList.remove('logged-in');
      // Reset sign-in steps
      document.querySelectorAll('.signin-step').forEach(s => s.classList.remove('active'));
      document.getElementById('step-email').classList.add('active');
      document.getElementById('input-email').value = '';
      document.getElementById('input-password').value = '';
      document.getElementById('grp-email').classList.remove('has-value', 'focused');
      document.getElementById('grp-password').classList.remove('has-value', 'focused');
      clearErr('signin-error-email'); clearErr('signin-error-pwd');
      // Show signin screen
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screen-signin').classList.add('active');
      showToast('Signed out successfully.');
    }

    // ═══════════ PROFILE ═══════════
    function getProfileKey(email) { return 'rs_profile_' + email; }
    function getProfile(email) { const s = localStorage.getItem(getProfileKey(email)); return s ? JSON.parse(s) : null; }
    function saveProfile(email, p) { localStorage.setItem(getProfileKey(email), JSON.stringify(p)); }

    function openProfileModal(isEdit) {
      if (!currentUser) return;
      const p = getProfile(currentUser.email);
      if (isEdit && p) {
        document.getElementById('pm-fullname').value = p.fullname || '';
        document.getElementById('pm-studentid').value = p.studentId || '';
        document.getElementById('pm-section').value = p.section || '';
        document.getElementById('pm-faculty').value = p.faculty || '';
        document.getElementById('pm-year').value = p.year || '';
      }
      document.getElementById('pm-email-display').textContent = currentUser.email;
      document.getElementById('profile-modal-overlay').classList.add('show');
    }
    function closeProfileModal() { document.getElementById('profile-modal-overlay').classList.remove('show'); }

    function clearPmError(fid) {
      document.getElementById(fid).classList.remove('error');
      const e = document.getElementById('err-' + fid.replace('pm-', ''));
      if (e) e.classList.remove('show');
    }

    function submitProfile() {
      const fullname = document.getElementById('pm-fullname').value.trim();
      const studentId = document.getElementById('pm-studentid').value.trim();
      const section = document.getElementById('pm-section').value;
      const faculty = document.getElementById('pm-faculty').value.trim();
      const year = document.getElementById('pm-year').value;
      let ok = true;
      if (!fullname) { document.getElementById('pm-fullname').classList.add('error'); document.getElementById('err-fullname').classList.add('show'); ok = false; }
      if (!studentId) { document.getElementById('pm-studentid').classList.add('error'); document.getElementById('err-studentid').classList.add('show'); ok = false; }
      if (!section) { document.getElementById('pm-section').classList.add('error'); document.getElementById('err-section').classList.add('show'); ok = false; }
      if (!ok) return;
      document.getElementById('pm-submit-txt').style.display = 'none';
      document.getElementById('pm-spinner').classList.add('show');
      document.getElementById('pm-submit-btn').disabled = true;
      setTimeout(() => {
        const profile = { fullname, studentId, section, faculty, year, email: currentUser.email, updatedAt: new Date().toISOString() };
        saveProfile(currentUser.email, profile);
        // Update UI
        document.getElementById('tb-name').textContent = fullname;
        document.getElementById('tb-avatar').textContent = fullname[0].toUpperCase();
        document.getElementById('tb-meta').textContent = `${studentId} · Sec.${section}`;
        document.getElementById('greeting-name').textContent = fullname.split(' ')[0];
        renderProfileCard(profile);
        document.getElementById('pm-submit-txt').style.display = 'inline';
        document.getElementById('pm-spinner').classList.remove('show');
        document.getElementById('pm-submit-btn').disabled = false;
        closeProfileModal();
        showToast('✅ Profile saved successfully!');
      }, 800);
    }

    function handlePhotoUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const ring = document.getElementById('pm-avatar-preview');
        ring.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        document.getElementById('tb-avatar').innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }

    function renderProfileCard(profile) {
      const card = document.getElementById('profile-info-card');
      if (!profile) { card.classList.remove('show'); return; }
      card.classList.add('show');
      document.getElementById('pic-av').textContent = profile.fullname[0].toUpperCase();
      document.getElementById('pic-name').textContent = profile.fullname;
      document.getElementById('pic-sid').textContent = '🎓 ' + profile.studentId;
      document.getElementById('pic-sec').textContent = 'Sec.' + profile.section;
      const yr = document.getElementById('pic-yr');
      if (profile.year) { yr.textContent = 'Year ' + profile.year; yr.style.display = ''; }
      else yr.style.display = 'none';
    }

    // ═══════════ NAVIGATION ═══════════
    const TABS = { 'screen-home': 'tab-home', 'screen-b': 'tab-b', 'screen-c': 'tab-c', 'screen-d': 'tab-d', 'screen-e': 'tab-e' };
    function nav(id) {
      if (id !== 'screen-signin' && !currentUser) return;
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
      const target = document.getElementById(id);
      if (target) target.classList.add('active');
      if (TABS[id]) document.getElementById(TABS[id]).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (id === 'screen-home') {
        updateGreeting();
        playHomeEntrance();
      }
    }

    // ═══════════ HOME: DYNAMIC GREETING & ENTRANCE ANIMATION ═══════════
    function updateGreeting() {
      const hour = new Date().getHours();
      let phrase, emoji;
      if (hour >= 5 && hour < 12) { phrase = 'Good morning,'; emoji = '🌅'; }
      else if (hour >= 12 && hour < 17) { phrase = 'Good afternoon,'; emoji = '☀️'; }
      else if (hour >= 17 && hour < 21) { phrase = 'Good evening,'; emoji = '🌇'; }
      else { phrase = 'Good evening,'; emoji = '🌙'; }
      const phraseEl = document.getElementById('greeting-phrase');
      const emojiEl = document.getElementById('greeting-emoji');
      if (phraseEl) phraseEl.textContent = phrase;
      if (emojiEl) emojiEl.textContent = emoji;
    }

    function playHomeEntrance() {
      const wrap = document.querySelector('#screen-home .home-wrap');
      if (!wrap) return;
      wrap.classList.remove('play-in');
      // Force reflow so the animation can retrigger every time Home is opened
      void wrap.offsetWidth;
      wrap.classList.add('play-in');
    }

    // ═══════════ MODULAR LESSON DETAIL & TOPIC VIEWER ═══════════
    let currentLessonUnit = 1;
    let currentTopicIndex = 0;
    const completedTopics = JSON.parse(localStorage.getItem('rs_completed_u1_topics') || '{}');

    function updateUnit1ProgressUI() {
      const total = 6;
      const doneCount = [1, 2, 3, 4, 5, 6].filter(k => completedTopics[k]).length;
      const pct = Math.round((doneCount / total) * 100);

      const bar = document.getElementById('u1-progress-bar');
      const pctText = document.getElementById('u1-progress-pct');
      if (bar) bar.style.width = pct + '%';
      if (pctText) pctText.textContent = `${pct}% Completed (${doneCount}/${total} Topics)`;

      for (let i = 1; i <= total; i++) {
        const card = document.getElementById(`u1-card-${i}`);
        const stat = document.getElementById(`u1-stat-${i}`);
        if (completedTopics[i]) {
          if (card) card.classList.add('completed');
          if (stat) { stat.textContent = '✓ Completed'; stat.classList.add('done'); }
        }
      }
    }

    // ═══════════ STAGE FILTERING & NAVIGATION ═══════════
    let currentSelectedStage = 1;

    function filterLessonStage(stageNum) {
      currentSelectedStage = stageNum;
      for (let i = 1; i <= 3; i++) {
        const tab = document.getElementById(`st-tab-${i}`);
        if (tab) tab.classList.toggle('active', i === stageNum);
      }

      const cards1 = document.querySelectorAll('.stage-sec-1');
      const cards2 = document.querySelectorAll('.stage-sec-2');
      const cards3 = document.querySelectorAll('.stage-sec-3');
      const title = document.getElementById('stage-info-title');
      const desc = document.getElementById('stage-info-desc');

      if (stageNum === 1) {
        cards1.forEach(c => c.style.display = 'flex');
        cards2.forEach(c => c.style.display = 'none');
        cards3.forEach(c => c.style.display = 'none');
        if (title) title.textContent = 'Stage 1: ก่อนอ่าน (Pre-Reading) — เรียนรู้ทฤษฎีและเครื่องมืออ่าน';
        if (desc) desc.textContent = 'เรียนรู้ทฤษฎีพื้นฐาน Text Features และคำศัพท์วิชาการ พร้อม Pre-test ก่อนเริ่มเรียน (Topic 1–2)';
      } else if (stageNum === 2) {
        cards1.forEach(c => c.style.display = 'none');
        cards2.forEach(c => c.style.display = 'flex');
        cards3.forEach(c => c.style.display = 'none');
        if (title) title.textContent = 'Stage 2: ระหว่างอ่าน (While-Reading) — ฝึกอ่านบทความจริง';
        if (desc) desc.textContent = 'เรียนรู้ Topic Sentence และ Main Idea แล้วฝึกอ่านบทความ 3 เรื่อง (สั้น–ยาว) พร้อมไฮไลท์แบบ Interactive และแบบฝึกหัด (Topic 3–5)';
      } else if (stageNum === 3) {
        cards1.forEach(c => c.style.display = 'none');
        cards2.forEach(c => c.style.display = 'none');
        cards3.forEach(c => c.style.display = 'flex');
        if (title) title.textContent = 'Stage 3: หลังอ่าน (Post-Reading) — ทบทวนและประเมินผล';
        if (desc) desc.textContent = 'แบบทดสอบประเมินตนเอง 5 ข้อ เกณฑ์ Scoring Rubric และบันทึกสะท้อนการเรียนรู้ (Topic 6)';
      } else {
        // Show all
        cards1.forEach(c => c.style.display = 'flex');
        cards2.forEach(c => c.style.display = 'flex');
        cards3.forEach(c => c.style.display = 'flex');
        if (title) title.textContent = 'Unit 1: All Topics Overview (Pre + While + Post Reading)';
        if (desc) desc.textContent = 'แสดงหัวข้อบทเรียนทั้ง 6 ส่วนของ Unit 1 ครบทั้ง 3 ขั้นตอน';
      }
    }

    function switchReaderStage(stageNum) {
      if (stageNum === 1) openLessonTopic(1);
      else if (stageNum === 2) openLessonTopic(3);
      else if (stageNum === 3) openLessonTopic(6);
    }

    function updateReaderStageTabs(topicIdx) {
      let stage = 1;
      if (topicIdx >= 3 && topicIdx <= 5) stage = 2;
      else if (topicIdx === 6) stage = 3;

      for (let i = 1; i <= 3; i++) {
        const rTab = document.getElementById(`rst-tab-${i}`);
        if (rTab) rTab.classList.toggle('active', i === stage);
      }
    }

    // Hides every Unit's hub-view and reader-view. Called before showing a
    // specific Unit so that switching Units (e.g. Unit 1 -> Unit 2 -> Unit 1)
    // never leaves the previous Unit's hub or reader content visible
    // underneath/alongside the newly opened Unit (this caused duplicated
    // content on Unit 2's hub and a "broken" Unit 1 view when returning to it).
    function resetAllUnitViews() {
      const u1hub = document.getElementById('unit1-hub-view');
      const u1reader = document.getElementById('unit1-reader-view');
      const u2hub = document.getElementById('unit2-hub-view');
      const u2reader = document.getElementById('unit2-reader-view');
      if (u1hub) u1hub.style.display = 'none';
      if (u1reader) u1reader.classList.remove('active');
      if (u2hub) u2hub.style.display = 'none';
      if (u2reader) u2reader.classList.remove('active');
    }

    function openLessonDetail(unitId) {
      resetAllUnitViews();
      if (unitId === 1) {
        currentLessonUnit = 1;
        document.getElementById('unit1-hub-view').style.display = 'block';
        updateUnit1ProgressUI();
        filterLessonStage(1);
        nav('screen-lesson-detail');
      } else if (unitId === 2) {
        currentLessonUnit = 2;
        document.getElementById('unit2-hub-view').style.display = 'block';
        updateUnit2ProgressUI();
        filterLessonStage2(1);
        nav('screen-lesson-detail');
      } else {
        showToast(`🔒 Unit ${unitId} อยู่ในแผนการสอนสัปดาห์ถัดไป (กำลังโฟกัสที่ Lesson Plan 1–2)`);
      }
    }

    const TOPIC_NAMES = [
      'Overview',
      'Topic 1: ส่วนประกอบของบทความ (Text Features)',
      'Topic 2: คำศัพท์วิชาการ (Vocabulary Preview)',
      'Topic 3: ประโยคใจความสำคัญ (Topic Sentence)',
      'Topic 4: ใจความสำคัญหลัก (Main Idea)',
      'Topic 5: ฝึกอ่านบทความ 1–3 (While-Reading)',
      'Topic 6: แบบประเมินตนเอง (Post-Reading Quiz)'
    ];

    // ═══════════════════════════════════════════════════════
    // ═══════════ ACTIVITY NAVIGATION SYSTEM ═══════════
    // (Topic → Activity hierarchy — replaces scroll-only quick-jump navigation)
    // ═══════════════════════════════════════════════════════
    //
    // ACTIVITY_MAP lists, for each Unit + Topic, the ordered Activities that make
    // up that Topic. Each entry's `id` is the id of the existing content block
    // (a .flow-card, or a new .activity-view wrapper for Unit 2 Topics 1–3) that
    // is shown/hidden as the student steps through the Topic.
    const ACTIVITY_MAP = {
      1: { // Unit 1 — Main Ideas
        1: [ // Topic 1: Text Features
          { id: 'topic-pane-1-intro', label: 'Introduction' },
          { id: 't1-pretest', label: 'Diagnostic Check' },
          { id: 't1-part1', label: 'What Are Text Features?' },
          { id: 't1-part2', label: 'Case Study' },
          { id: 't1-part3', label: 'Common Mistakes' },
          { id: 't1-part4', label: 'Skimming & Scanning' },
          { id: 't1-part5', label: 'Guided Practice' },
          { id: 't1-part6', label: 'Reading Practice' }
        ],
        2: [ // Topic 2: Vocabulary Preview
          { id: 'topic-pane-2-intro', label: 'Introduction' },
          { id: 't6-part1', label: 'Key Vocabulary' },
          { id: 't6-part1b', label: 'Context Clue Examples' },
          { id: 't6-part2', label: 'Vocabulary Practice' },
          { id: 't6-part3', label: 'Reading Practice' }
        ],
        3: [ // Topic 3: Topic Sentence
          { id: 'topic-pane-3-intro', label: 'Introduction' },
          { id: 't2-part1', label: 'Sentence Dissector' },
          { id: 't2-part2', label: 'Where Is It?' },
          { id: 't2-part3', label: 'Worked Examples' },
          { id: 't2-part4', label: 'Common Traps' },
          { id: 't2-part5', label: '10-Second Method' },
          { id: 't2-part6', label: 'Practice' },
          { id: 't2-part7', label: 'Reading Practice' }
        ],
        4: [ // Topic 4: Main Idea
          { id: 'topic-pane-4-intro', label: 'Introduction' },
          { id: 't3-part1', label: 'Topic vs. Main Idea' },
          { id: 't3-part2', label: 'Implied Main Idea' },
          { id: 't3-part3', label: 'Common Mistakes' },
          { id: 't3-part4', label: '1-Minute Method' },
          { id: 't3-part5', label: 'Practice' },
          { id: 't3-part6', label: 'Reading Practice' }
        ],
        5: [ // Topic 5: Reading Practice (3 passages, each a separate Activity)
          { id: 'topic-pane-5-intro', label: 'Introduction' },
          { id: 't7-p1', label: 'Passage 1' },
          { id: 't7-p3', label: 'Passage 2' },
          { id: 't7-p5', label: 'Passage 3' }
        ],
        6: [ // Topic 6: Post-Reading & Self-Check
          { id: 'topic-pane-6-intro', label: 'Introduction' },
          { id: 't8-part0', label: 'Reflection Examples' },
          { id: 't8-part1', label: 'Self-Check Quiz' },
          { id: 't8-part2', label: 'Scoring Rubric' }
        ]
      },
      2: { // Unit 2 — Supporting Details & Idea Relationships
        1: [ // Topic 1: Major & Minor Supporting Details
          { id: 'topic2-pane-1-intro', label: 'Introduction' },
          { id: 'u2t1-learn', label: 'Learn' },
          { id: 'u2t1-practice', label: 'Practice' }
        ],
        2: [ // Topic 2: Skimming & Scanning Strategies
          { id: 'topic2-pane-2-intro', label: 'Introduction' },
          { id: 'u2t2-learn', label: 'Learn' },
          { id: 'u2t2-practice', label: 'Practice' }
        ],
        3: [ // Topic 3: Idea Relationships & Signal Words
          { id: 'topic2-pane-3-intro', label: 'Introduction' },
          { id: 'u2t3-learn', label: 'Learn' },
          { id: 'u2t3-practice', label: 'Practice' }
        ],
        4: [ // Topic 4: Reading Practice (Main Idea Challenge, 3 passages)
          { id: 'topic2-pane-4-intro', label: 'Introduction' },
          { id: 't2u-p1', label: 'Passage 1' },
          { id: 't2u-p2', label: 'Passage 2' },
          { id: 't2u-p3', label: 'Passage 3' }
        ],
        5: [ // Topic 5: Timed Scanning Task — intro + one cohesive task activity
          { id: 'topic2-pane-5-intro', label: 'Introduction' },
          { id: 't2u-scan', label: 'Timed Scanning Task' }
        ],
        6: [ // Topic 6: Post-Reading & Self-Check
          { id: 'topic2-pane-6-intro', label: 'Introduction' },
          { id: 't2u-quiz', label: 'Self-Check Quiz' },
          { id: 't2u-rubric', label: 'Scoring Rubric' }
        ]
      }
    };

    let currentActivityIndex1 = 0; // currentActivityIndex for Unit 1's open Topic
    let currentActivityIndex2 = 0; // currentActivityIndex for Unit 2's open Topic

    function getTopicActivities(unit, topicIdx) {
      return (ACTIVITY_MAP[unit] && ACTIVITY_MAP[unit][topicIdx]) || [];
    }

    function loadActivityProgress(unit) {
      return JSON.parse(localStorage.getItem(`rs_activity_progress_u${unit}`) || '{}');
    }
    function saveActivityProgress(unit, data) {
      localStorage.setItem(`rs_activity_progress_u${unit}`, JSON.stringify(data));
    }

    // OPENED = viewed / in progress. Recorded the moment a Topic is opened,
    // but this alone must NOT mark the Topic as "completed".
    function markTopicOpened(unit, topicIdx) {
      const key = `rs_opened_u${unit}_topics`;
      const opened = JSON.parse(localStorage.getItem(key) || '{}');
      opened[topicIdx] = true;
      localStorage.setItem(key, JSON.stringify(opened));
    }

    // Show Activity `activityIndex` of Topic `topicIdx` in `unit`, hide the rest.
    // `isInitialOpen` is true only when this call comes from first opening the
    // Topic (e.g. openLessonTopic/openLessonTopic2 landing on Activity 0) — in
    // that case, simply landing on the last Activity of a single-Activity Topic
    // must NOT be treated as having "reached" it, or the Topic would be marked
    // completed the instant it is opened. Real navigation (stepper clicks,
    // Prev/Next) always passes isInitialOpen = false.
    function openTopicActivity(unit, topicIdx, activityIndex, isInitialOpen) {
      const acts = getTopicActivities(unit, topicIdx);
      if (!acts.length) {
        updateActivityNavigation(unit, topicIdx);
        return;
      }
      if (activityIndex < 0) activityIndex = 0;
      if (activityIndex > acts.length - 1) activityIndex = acts.length - 1;

      if (unit === 1) currentActivityIndex1 = activityIndex;
      else currentActivityIndex2 = activityIndex;

      acts.forEach((a, i) => {
        const el = document.getElementById(a.id);
        if (el) el.classList.toggle('active', i === activityIndex);
      });

      markActivityViewed(unit, topicIdx, activityIndex, !!isInitialOpen);
      updateActivityNavigation(unit, topicIdx);
    }

    // Record that this Activity has been viewed. If it is the Topic's final
    // required Activity AND the student actually navigated to it (rather than
    // just landing there when the Topic was first opened), the Topic is now
    // COMPLETED (not merely opened).
    function markActivityViewed(unit, topicIdx, activityIndex, isInitialOpen) {
      const progress = loadActivityProgress(unit);
      if (!progress[topicIdx]) progress[topicIdx] = [];
      progress[topicIdx][activityIndex] = true;
      saveActivityProgress(unit, progress);

      const acts = getTopicActivities(unit, topicIdx);
      if (activityIndex === acts.length - 1 && !isInitialOpen) {
        markActivityCompleted(unit, topicIdx);
      }
    }

    function markActivityCompleted(unit, topicIdx) {
      updateTopicCompletion(unit, topicIdx);
    }

    // COMPLETED = student has reached the Topic's final required Activity.
    function updateTopicCompletion(unit, topicIdx) {
      if (unit === 1) {
        completedTopics[topicIdx] = true;
        localStorage.setItem('rs_completed_u1_topics', JSON.stringify(completedTopics));
        updateUnit1ProgressUI();
      } else if (unit === 2) {
        completedTopics2[topicIdx] = true;
        localStorage.setItem('rs_completed_u2_topics', JSON.stringify(completedTopics2));
        updateUnit2ProgressUI();
      }
    }

    // Prev/Next across Activities inside the current Topic. Stepping past the
    // last Activity moves on to the next Topic (mirrors the existing Topic-level nav).
    function navigateTopicActivity(unit, step) {
      const topicIdx = (unit === 1) ? currentTopicIndex : currentTopicIndex2;
      const acts = getTopicActivities(unit, topicIdx);
      const cur = (unit === 1) ? currentActivityIndex1 : currentActivityIndex2;
      const next = cur + step;

      if (next < 0) return;
      if (next > acts.length - 1) {
        if (unit === 1) navigateLessonTopic(1); else navigateLessonTopic2(1);
        return;
      }
      openTopicActivity(unit, topicIdx, next);
    }

    // Render the stepper, context line, and footer nav for the currently open Topic.
    function updateActivityNavigation(unit, topicIdx) {
      const acts = getTopicActivities(unit, topicIdx);
      const stepperWrap = document.getElementById(`u${unit}-activity-stepper-wrap`);
      const contextEl = document.getElementById(`u${unit}-activity-context`);
      const labelEl = document.getElementById(`u${unit}-activity-stepper-label`);
      const stepperEl = document.getElementById(`u${unit}-activity-stepper`);
      const footerEl = document.getElementById(`u${unit}-activity-footer-nav`);
      const midEl = document.getElementById(`u${unit}-act-mid`);
      const prevBtn = document.getElementById(`u${unit}-act-prev-btn`);
      const nextBtn = document.getElementById(`u${unit}-act-next-btn`);

      if (!acts.length) {
        if (stepperWrap) stepperWrap.style.display = 'none';
        if (footerEl) footerEl.style.display = 'none';
        if (contextEl) contextEl.innerHTML = '';
        return;
      }

      const cur = (unit === 1) ? currentActivityIndex1 : currentActivityIndex2;
      const progress = loadActivityProgress(unit)[topicIdx] || [];
      const unitName = (unit === 1) ? 'Unit 1' : 'Unit 2';
      const topicNames = (unit === 1) ? TOPIC_NAMES : TOPIC_NAMES2;
      const topicLabel = (topicNames[topicIdx] || `Topic ${topicIdx}`).replace(/^Topic \d+:\s*/, '');

      if (contextEl) {
        contextEl.innerHTML = `${unitName} · <strong>Topic ${topicIdx}</strong>: ${topicLabel} · Activity ${cur + 1} of ${acts.length}`;
      }

      if (acts.length <= 1) {
        // Single-Activity Topic (e.g. Timed Scanning Task): no stepper needed.
        if (stepperWrap) stepperWrap.style.display = 'none';
      } else {
        if (stepperWrap) stepperWrap.style.display = 'block';
        if (labelEl) labelEl.textContent = `Activity ${cur + 1} of ${acts.length}`;
        if (stepperEl) {
          stepperEl.innerHTML = acts.map((a, i) => {
            const done = !!progress[i];
            const isCur = i === cur;
            const dot = done ? '✓' : String(i + 1);
            return `<button type="button" class="activity-step ${done ? 'done' : ''} ${isCur ? 'current' : ''}" `
              + `onclick="openTopicActivity(${unit}, ${topicIdx}, ${i})" aria-current="${isCur}">`
              + `<span class="as-dot">${dot}</span>${a.label}</button>`;
          }).join('');
        }
      }

      if (footerEl) footerEl.style.display = 'flex';
      if (prevBtn) prevBtn.disabled = (cur === 0);
      const isLast = (cur === acts.length - 1);
      if (nextBtn) {
        if (isLast) {
          nextBtn.textContent = (topicIdx >= 6) ? 'Finish Unit ✓' : 'Complete & Next Topic →';
        } else {
          nextBtn.textContent = 'Next →';
        }
      }
      if (midEl) {
        const doneCount = progress.filter(Boolean).length;
        midEl.textContent = `${doneCount}/${acts.length} activities viewed`;
      }
    }

    function openLessonTopic(topicIdx) {
      currentTopicIndex = topicIdx;
      document.getElementById('unit1-hub-view').style.display = 'none';
      const reader = document.getElementById('unit1-reader-view');
      reader.classList.add('active');

      // Update header, stage tabs, and select dropdown
      document.getElementById('reader-topic-meta').textContent = `${TOPIC_NAMES[topicIdx] || 'Topic ' + topicIdx}`;
      document.getElementById('reader-quick-select').value = topicIdx;
      updateReaderStageTabs(topicIdx);

      // Show only current topic pane
      for (let i = 1; i <= 6; i++) {
        const pane = document.getElementById(`topic-pane-${i}`);
        if (pane) pane.style.display = (i === topicIdx) ? 'block' : 'none';
      }

      // Update prev / next buttons
      const prevBtn = document.getElementById('rfn-prev-btn');
      const nextBtn = document.getElementById('rfn-next-btn');
      if (prevBtn) prevBtn.style.visibility = (topicIdx <= 1) ? 'hidden' : 'visible';
      if (nextBtn) nextBtn.textContent = (topicIdx === 6) ? 'Finish Unit 1 🏁' : 'Next Topic ➔';

      // NOTE: Opening a Topic marks it "viewed / in progress" only.
      // Full "completed" status is granted by updateTopicCompletion(), once the
      // student reaches the Topic's final required Activity (see openTopicActivity()).
      markTopicOpened(1, topicIdx);

      // Load this Topic's Activity Navigation (stepper) at its first Activity.
      openTopicActivity(1, topicIdx, 0, true);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function closeLessonTopic() {
      document.getElementById('unit1-reader-view').classList.remove('active');
      document.getElementById('unit1-hub-view').style.display = 'block';
      updateUnit1ProgressUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function navigateLessonTopic(step) {
      const nextIdx = currentTopicIndex + step;
      if (nextIdx >= 1 && nextIdx <= 6) {
        openLessonTopic(nextIdx);
      } else if (nextIdx > 6) {
        showToast('🎉 ยินดีด้วย! คุณเรียนครบทุกหัวข้อใน Unit 1 เรียบร้อยแล้ว');
        closeLessonTopic();
      }
    }

    // ═══════════════════════════════════════════════════════
    // ═══════════ UNIT 2: SUPPORTING DETAILS & IDEA RELATIONSHIPS ═══════════
    // ═══════════════════════════════════════════════════════
    let currentTopicIndex2 = 0;
    const completedTopics2 = JSON.parse(localStorage.getItem('rs_completed_u2_topics') || '{}');

    function updateUnit2ProgressUI() {
      const total = 6;
      const doneCount = [1, 2, 3, 4, 5, 6].filter(k => completedTopics2[k]).length;
      const pct = Math.round((doneCount / total) * 100);

      const bar = document.getElementById('u2-progress-bar');
      const pctText = document.getElementById('u2-progress-pct');
      if (bar) bar.style.width = pct + '%';
      if (pctText) pctText.textContent = `${pct}% Completed (${doneCount}/${total} Topics)`;

      for (let i = 1; i <= total; i++) {
        const card = document.getElementById(`u2-card-${i}`);
        const stat = document.getElementById(`u2-stat-${i}`);
        if (completedTopics2[i]) {
          if (card) card.classList.add('completed');
          if (stat) { stat.textContent = '✓ Completed'; stat.classList.add('done'); }
        }
      }
    }

    let currentSelectedStage2 = 1;

    function filterLessonStage2(stageNum) {
      currentSelectedStage2 = stageNum;
      for (let i = 1; i <= 3; i++) {
        const tab = document.getElementById(`st2-tab-${i}`);
        if (tab) tab.classList.toggle('active', i === stageNum);
      }

      const cards1 = document.querySelectorAll('.stage-sec2-1');
      const cards2 = document.querySelectorAll('.stage-sec2-2');
      const cards3 = document.querySelectorAll('.stage-sec2-3');
      const title = document.getElementById('stage-info-title2');
      const desc = document.getElementById('stage-info-desc2');

      if (stageNum === 1) {
        cards1.forEach(c => c.style.display = 'flex');
        cards2.forEach(c => c.style.display = 'none');
        cards3.forEach(c => c.style.display = 'none');
        if (title) title.textContent = 'Stage 1: ก่อนอ่าน (Pre-Reading) — Supporting Details, Skimming & Scanning';
        if (desc) desc.textContent = 'เรียนรู้ Major/Minor Supporting Details และกลยุทธ์ Skimming กับ Scanning (Topic 1–2)';
      } else if (stageNum === 2) {
        cards1.forEach(c => c.style.display = 'none');
        cards2.forEach(c => c.style.display = 'flex');
        cards3.forEach(c => c.style.display = 'none');
        if (title) title.textContent = 'Stage 2: ระหว่างอ่าน (While-Reading) — Idea Relationships & Practice';
        if (desc) desc.textContent = 'เรียนรู้ความสัมพันธ์ของใจความ (Cause-Effect, Compare-Contrast, Sequence) ฝึก Main Idea Challenge และ Timed Scanning Task (Topic 3–5)';
      } else if (stageNum === 3) {
        cards1.forEach(c => c.style.display = 'none');
        cards2.forEach(c => c.style.display = 'none');
        cards3.forEach(c => c.style.display = 'flex');
        if (title) title.textContent = 'Stage 3: หลังอ่าน (Post-Reading) — ทบทวนและประเมินผล';
        if (desc) desc.textContent = 'แบบทดสอบประเมินตนเอง 5 ข้อ ทบทวน Unit 2 ทั้งหมด (Topic 6)';
      } else {
        cards1.forEach(c => c.style.display = 'flex');
        cards2.forEach(c => c.style.display = 'flex');
        cards3.forEach(c => c.style.display = 'flex');
        if (title) title.textContent = 'Unit 2: All Topics Overview (Pre + While + Post Reading)';
        if (desc) desc.textContent = 'แสดงหัวข้อบทเรียนทั้ง 6 ส่วนของ Unit 2 ครบทั้ง 3 ขั้นตอน';
      }
    }

    function switchReaderStage2(stageNum) {
      if (stageNum === 1) openLessonTopic2(1);
      else if (stageNum === 2) openLessonTopic2(3);
      else if (stageNum === 3) openLessonTopic2(6);
    }

    function updateReaderStageTabs2(topicIdx) {
      let stage = 1;
      if (topicIdx >= 3 && topicIdx <= 5) stage = 2;
      else if (topicIdx === 6) stage = 3;

      for (let i = 1; i <= 3; i++) {
        const rTab = document.getElementById(`rst2-tab-${i}`);
        if (rTab) rTab.classList.toggle('active', i === stage);
      }
    }

    const TOPIC_NAMES2 = [
      'Overview',
      'Topic 1: Major & Minor Supporting Details',
      'Topic 2: Skimming & Scanning Strategies',
      'Topic 3: Idea Relationships & Signal Words',
      'Topic 4: ฝึกอ่าน — Main Idea Challenge',
      'Topic 5: Timed Scanning Task',
      'Topic 6: แบบประเมินตนเอง (Post-Reading Quiz)'
    ];

    function openLessonTopic2(topicIdx) {
      currentTopicIndex2 = topicIdx;
      document.getElementById('unit2-hub-view').style.display = 'none';
      const reader = document.getElementById('unit2-reader-view');
      reader.classList.add('active');

      document.getElementById('reader-topic-meta2').textContent = `${TOPIC_NAMES2[topicIdx] || 'Topic ' + topicIdx}`;
      document.getElementById('reader-quick-select2').value = topicIdx;
      updateReaderStageTabs2(topicIdx);

      for (let i = 1; i <= 6; i++) {
        const pane = document.getElementById(`topic2-pane-${i}`);
        if (pane) pane.style.display = (i === topicIdx) ? 'block' : 'none';
      }

      const prevBtn = document.getElementById('rfn2-prev-btn');
      const nextBtn = document.getElementById('rfn2-next-btn');
      if (prevBtn) prevBtn.style.visibility = (topicIdx <= 1) ? 'hidden' : 'visible';
      if (nextBtn) nextBtn.textContent = (topicIdx === 6) ? 'Finish Unit 2 🏁' : 'Next Topic ➔';

      // NOTE: Opening a Topic marks it "viewed / in progress" only — see openLessonTopic() note above.
      markTopicOpened(2, topicIdx);

      openTopicActivity(2, topicIdx, 0, true);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function closeLessonTopic2() {
      document.getElementById('unit2-reader-view').classList.remove('active');
      document.getElementById('unit2-hub-view').style.display = 'block';
      updateUnit2ProgressUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function navigateLessonTopic2(step) {
      const nextIdx = currentTopicIndex2 + step;
      if (nextIdx >= 1 && nextIdx <= 6) {
        openLessonTopic2(nextIdx);
      } else if (nextIdx > 6) {
        showToast('🎉 ยินดีด้วย! คุณเรียนครบทุกหัวข้อใน Unit 2 เรียบร้อยแล้ว');
        closeLessonTopic2();
      }
    }

    // ── Unit 2: 3-Color Highlighter (Yellow=Main Idea, Green=Major Detail, Blue=Minor Detail) ──
    let currentHlMode2 = 'main';

    function setHlMode2(mode) {
      currentHlMode2 = mode;
      ['main', 'major', 'minor'].forEach(m => {
        const btn = document.getElementById(`hl2-mode-${m}`);
        if (btn) btn.classList.toggle('active', m === mode);
      });
    }

    function toggleSentenceHl2(el) {
      const cls = `hl-${currentHlMode2}`;
      if (el.classList.contains(cls)) {
        el.classList.remove(cls);
      } else {
        el.classList.remove('hl-main', 'hl-major', 'hl-minor');
        el.classList.add(cls);
      }
    }

    function clearPassageHighlights2(containerId) {
      const scope = containerId ? document.getElementById(containerId) : document.getElementById('unit2-reader-view');
      if (!scope) return;
      scope.querySelectorAll('.passage-sentence').forEach(s => {
        s.classList.remove('hl-main', 'hl-major', 'hl-minor');
      });
    }

    // ── Unit 2: Timed Scanning Task ──
    const scanTimers = {};

    function startScanTask(id, seconds) {
      const display = document.getElementById(`scan-timer-${id}`);
      const startBtn = document.getElementById(`scan-start-${id}`);
      if (scanTimers[id]) clearInterval(scanTimers[id]);
      let remaining = seconds;
      if (display) { display.textContent = `⏱ ${remaining}s`; display.classList.add('scan-live'); }
      if (startBtn) startBtn.disabled = true;
      document.querySelectorAll(`#scan-box-${id} .ex-opt`).forEach(b => b.disabled = false);

      scanTimers[id] = setInterval(() => {
        remaining--;
        if (display) display.textContent = `⏱ ${remaining}s`;
        if (remaining <= 0) {
          clearInterval(scanTimers[id]);
          if (display) { display.textContent = '⏰ หมดเวลา!'; display.classList.remove('scan-live'); }
          document.querySelectorAll(`#scan-box-${id} .ex-opt`).forEach(b => b.disabled = true);
          const fb = document.getElementById(`scan-box-${id}-fb`);
          if (fb) { fb.textContent = 'หมดเวลาสแกนหาคำตอบแล้ว ลองกด Reset เพื่อฝึกใหม่อีกครั้ง'; fb.className = 'ex-feedback show wrong'; }
        }
      }, 1000);
    }

    function checkScanAnswer(scanId, boxId, optIndex, isCorrect, feedbackMsg) {
      if (scanTimers[scanId]) {
        clearInterval(scanTimers[scanId]);
        const display = document.getElementById(`scan-timer-${scanId}`);
        if (display) display.classList.remove('scan-live');
      }
      checkModularAnswer(boxId, optIndex, isCorrect, feedbackMsg);
      document.querySelectorAll(`#${boxId} .ex-opt`).forEach(b => b.disabled = true);
    }

    function resetScanTask(id, seconds) {
      if (scanTimers[id]) clearInterval(scanTimers[id]);
      const display = document.getElementById(`scan-timer-${id}`);
      const startBtn = document.getElementById(`scan-start-${id}`);
      if (display) { display.textContent = `⏱ ${seconds}s`; display.classList.remove('scan-live'); }
      if (startBtn) startBtn.disabled = false;
      const box = document.getElementById(`scan-box-${id}`);
      if (box) {
        box.querySelectorAll('.ex-opt').forEach(b => { b.disabled = true; b.classList.remove('ex-correct', 'ex-wrong', 'ex-selected'); });
      }
      const fb = document.getElementById(`scan-box-${id}-fb`);
      if (fb) { fb.textContent = ''; fb.className = 'ex-feedback'; }
    }

    // ═══════════ MODULAR MINI-EXERCISE CHECKER ═══════════
    function checkModularAnswer(boxId, optIndex, isCorrect, feedbackMsg) {
      const box = document.getElementById(boxId);
      if (!box) return;
      const opts = box.querySelectorAll('.ex-opt');
      const fb = document.getElementById(`${boxId}-fb`);

      opts.forEach((btn, idx) => {
        btn.classList.remove('ex-selected', 'ex-correct', 'ex-wrong');
        if (idx === optIndex) {
          if (isCorrect) {
            btn.classList.add('ex-correct');
          } else {
            btn.classList.add('ex-wrong');
          }
        }
      });

      if (fb) {
        fb.textContent = feedbackMsg;
        fb.className = `ex-feedback show ${isCorrect ? 'correct' : 'wrong'}`;
      }

      if (isCorrect) {
        showToast('🌟 ถูกต้อง! (Correct answer)');
      }
    }

    // ═══════════ INTERACTIVE WIDGET HANDLERS ═══════════
    function scrollToSubSection(elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.style.borderColor = 'var(--gold)';
        el.style.boxShadow = '0 0 24px rgba(232, 201, 122, 0.35)';
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }, 1500);
      }
    }

    function switchDeepDiveTab(containerId, tabIndex) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const btns = container.querySelectorAll('.dd-tab-btn');
      const panes = container.querySelectorAll('.dd-tab-pane');

      btns.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === tabIndex);
      });

      panes.forEach((pane, idx) => {
        pane.classList.toggle('active', idx === tabIndex);
      });
    }

    function toggleFlipCard(cardEl) {
      if (cardEl) {
        cardEl.classList.toggle('flipped');
      }
    }

    function dissectSentence(tokenEl, roleType, roleLabel, explainMsg, targetBoxId) {
      const parent = tokenEl.closest('.sentence-dissector');
      if (!parent) return;

      // Clear previous token highlights in this widget
      parent.querySelectorAll('.sd-token').forEach(t => {
        t.className = 'sd-token';
      });

      // Apply specific active class
      tokenEl.classList.add(`active-${roleType}`);

      // Update description box
      const box = document.getElementById(targetBoxId);
      if (box) {
        let badgeClass = 'sdr-gold';
        if (roleType === 'idea') badgeClass = 'sdr-teal';
        if (roleType === 'signal') badgeClass = 'sdr-purple';
        if (roleType === 'detail') badgeClass = 'sdr-green';

        box.innerHTML = `
      <div class="sd-role-badge ${badgeClass}">${roleLabel}</div>
      <div class="sd-role-desc">${explainMsg}</div>
    `;
      }
    }

    // ═══════════ STRATEGY VIEWER & PREVIEW SIMULATOR ═══════════
    function openStrategyDetail(unitId) {
      if (unitId === 1) {
        document.getElementById('strat-view-title').textContent = 'Unit 1: Previewing & Predicting';
        nav('screen-strategy-detail');
      } else if (unitId === 2) {
        openStrat2Activity(0);
        nav('screen-strategy-detail-2');
      } else {
        showToast(`Strategy ${unitId} guide is available in course materials.`);
      }
    }

    // ═══════════ UNIT 2 STRATEGY GUIDE: SKIMMING & SCANNING — ACTIVITY NAV ═══════════
    // Standalone strategy content (distinct from Reading Lessons Unit 2, Topic 2),
    // using the same Activity Navigation component/CSS for a consistent experience.
    const STRAT2_ACTIVITIES = [
      { id: 'strat2-a1', label: 'Overview' },
      { id: 'strat2-a2', label: 'What Is Skimming?' },
      { id: 'strat2-a3', label: 'What Is Scanning?' },
      { id: 'strat2-a4', label: 'Skimming vs. Scanning' },
      { id: 'strat2-a5', label: 'Guided Practice' },
      { id: 'strat2-a6', label: 'Strategy Check' }
    ];
    let currentStrat2Activity = 0;

    function openStrat2Activity(idx) {
      if (idx < 0) idx = 0;
      if (idx > STRAT2_ACTIVITIES.length - 1) idx = STRAT2_ACTIVITIES.length - 1;
      currentStrat2Activity = idx;

      STRAT2_ACTIVITIES.forEach((a, i) => {
        const el = document.getElementById(a.id);
        if (el) el.classList.toggle('active', i === idx);
      });

      updateStrat2Nav();
      const screenEl = document.getElementById('screen-strategy-detail-2');
      if (screenEl) screenEl.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function navigateStrat2Activity(step) {
      const next = currentStrat2Activity + step;
      if (next < 0 || next > STRAT2_ACTIVITIES.length - 1) return;
      openStrat2Activity(next);
    }

    function updateStrat2Nav() {
      const contextEl = document.getElementById('strat2-activity-context');
      const labelEl = document.getElementById('strat2-activity-stepper-label');
      const stepperEl = document.getElementById('strat2-activity-stepper');
      const midEl = document.getElementById('strat2-act-mid');
      const prevBtn = document.getElementById('strat2-act-prev-btn');
      const nextBtn = document.getElementById('strat2-act-next-btn');
      const total = STRAT2_ACTIVITIES.length;
      const cur = currentStrat2Activity;

      if (contextEl) contextEl.innerHTML = `Reading Strategies · <strong>Unit 2</strong>: Skimming &amp; Scanning · Activity ${cur + 1} of ${total}`;
      if (labelEl) labelEl.textContent = `Activity ${cur + 1} of ${total}`;
      if (stepperEl) {
        stepperEl.innerHTML = STRAT2_ACTIVITIES.map((a, i) => {
          const done = i < cur;
          const isCur = i === cur;
          const dot = done ? '✓' : String(i + 1);
          return `<button type="button" class="activity-step ${done ? 'done' : ''} ${isCur ? 'current' : ''}" `
            + `onclick="openStrat2Activity(${i})" aria-current="${isCur}">`
            + `<span class="as-dot">${dot}</span>${a.label}</button>`;
        }).join('');
      }
      if (prevBtn) prevBtn.disabled = (cur === 0);
      if (nextBtn) {
        nextBtn.disabled = (cur === total - 1);
        nextBtn.textContent = (cur === total - 1) ? 'Finished ✓' : 'Next →';
      }
      if (midEl) midEl.textContent = `${cur + 1}/${total} activities`;
    }

    const inspectedClues = {};
    function inspectClue(clueNum, desc, confidencePct) {
      inspectedClues[clueNum] = true;
      const clueEl = document.getElementById(`clue-${clueNum}`);
      if (clueEl) clueEl.classList.add('inspected');

      const count = Object.keys(inspectedClues).length;
      const meter = document.getElementById('sim-meter');
      const text = document.getElementById('sim-confidence-text');
      const fbBox = document.getElementById('sim-feedback-box');

      const currentPct = Math.min(100, Math.max(confidencePct, count * 25));
      if (meter) meter.style.width = currentPct + '%';
      if (text) text.textContent = `${currentPct}% Confidence (${count}/4 Clues Inspected)`;

      if (fbBox) {
        fbBox.style.display = 'block';
        fbBox.innerHTML = `🔍 <strong>Clue Discovered:</strong> ${desc}<br><span style="font-size:.78rem;color:var(--teal);">💡 Notice how combining this clue with prior knowledge sharpens your prediction!</span>`;
      }
    }

    // ═══════════ HIGHLIGHTER TOOL ═══════════
    let currentHlMode = 'topic'; // 'topic' or 'detail'

    function setHlMode(mode) {
      currentHlMode = mode;
      document.getElementById('hl-mode-topic').classList.toggle('active', mode === 'topic');
      document.getElementById('hl-mode-detail').classList.toggle('active', mode === 'detail');
      showToast(mode === 'topic' ? '🟡 Selected: Topic Sentence Highlighter' : '🟢 Selected: Supporting Details Highlighter');
    }

    function toggleSentenceHl(el) {
      if (currentHlMode === 'topic') {
        if (el.classList.contains('hl-topic')) {
          el.classList.remove('hl-topic');
        } else {
          el.classList.remove('hl-detail');
          el.classList.add('hl-topic');
          showToast('🟡 Highlighted as Topic Sentence');
        }
      } else if (currentHlMode === 'detail') {
        if (el.classList.contains('hl-detail')) {
          el.classList.remove('hl-detail');
        } else {
          el.classList.remove('hl-topic');
          el.classList.add('hl-detail');
          showToast('🟢 Highlighted as Supporting Detail');
        }
      }
    }

    function clearPassageHighlights() {
      document.querySelectorAll('.passage-sentence').forEach(s => {
        s.classList.remove('hl-topic', 'hl-detail');
      });
      showToast('Cleared all highlights.');
    }

    // ═══════════ INTERACTIVE QUIZ ENGINE ═══════════
    let quizScore = 0;
    const answeredQuestions = {};

    function openInteractiveQuiz(unitId) {
      if (unitId === 1) {
        quizScore = 0;
        for (let k in answeredQuestions) delete answeredQuestions[k];
        document.querySelectorAll('.quiz-opt').forEach(opt => {
          opt.classList.remove('selected', 'correct', 'wrong', 'locked');
          opt.disabled = false;
        });
        document.querySelectorAll('.quiz-feedback').forEach(fb => {
          fb.className = 'quiz-feedback';
          fb.textContent = '';
          fb.style.display = 'none';
        });
        document.getElementById('quiz-score-badge').textContent = 'Score: 0 / 5';
        nav('screen-quiz-interactive');
      } else {
        showToast(`Quiz for Unit ${unitId} is scheduled in upcoming weeks.`);
      }
    }

    function selectQuizAnswer(qNum, optIdx, isCorrect, feedbackMsg) {
      if (answeredQuestions[qNum]) return; // Already answered
      answeredQuestions[qNum] = isCorrect;

      const qBox = document.getElementById(`qbox-${qNum}`);
      const opts = qBox.querySelectorAll('.quiz-opt');

      opts.forEach((btn, idx) => {
        btn.classList.add('locked');
        btn.disabled = true;
        if (idx === optIdx) {
          if (isCorrect) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
          }
        }
        // Also highlight correct answer if wrong was picked
        if (!isCorrect && isCorrectOption(qNum, idx)) {
          btn.classList.add('correct');
        }
      });

      if (isCorrect) quizScore++;

      const fb = document.getElementById(`qfb-${qNum}`);
      fb.textContent = feedbackMsg;
      fb.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
      fb.style.display = 'block';

      document.getElementById('quiz-score-badge').textContent = `Score: ${quizScore} / 5`;
    }

    function isCorrectOption(qNum, idx) {
      if (qNum === 1 && idx === 1) return true;
      if (qNum === 2 && idx === 1) return true;
      if (qNum === 3 && idx === 0) return true;
      if (qNum === 4 && idx === 1) return true;
      if (qNum === 5 && idx === 2) return true;
      return false;
    }

    function finishQuiz() {
      const totalAnswered = Object.keys(answeredQuestions).length;
      if (totalAnswered < 5) {
        showToast(`กรุณาตอบคำถามให้ครบทั้ง 5 ข้อก่อน (ทำแล้ว ${totalAnswered}/5)`);
        return;
      }
      const pct = Math.round((quizScore / 5) * 100);
      showToast(`🎉 ทำควิซเสร็จสิ้น! คะแนนของคุณ: ${quizScore}/5 (${pct}%)`);

      // Return to progress screen to see updated record
      setTimeout(() => {
        nav('screen-e');
      }, 1200);
    }

    // ═══════════ TOAST ═══════════
    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg; t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3500);
    }

    // Close modal on overlay click
    document.getElementById('profile-modal-overlay').addEventListener('click', function (e) {
      if (e.target === this) closeProfileModal();
    });

    // ══════════════════════════════════════════════════════════
    // AMBIENT PEACEFUL FALLING SNOW (FIXED BACKGROUND)
    // ══════════════════════════════════════════════════════════
    (function initAmbientSnow() {
      const canvas = document.getElementById('ambient-snow-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const isMobile = width < 768;
      const particleCount = isMobile ? 40 : 75;
      const particles = [];

      // The whole app now uses the Direction G cozy-lavender palette, so
      // every screen gets the brighter, more visible snow treatment.
      function isLightScreen() {
        return true;
      }

      // Mouse-reactive "wind" — snow gently drifts away from the pointer.
      let mouseX = null, mouseY = null;
      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
      window.addEventListener('mouseleave', function () {
        mouseX = null;
        mouseY = null;
      });

      class Snowflake {
        constructor() {
          this.reset(true);
        }
        reset(initial = false) {
          this.x = Math.random() * width;
          this.y = initial ? Math.random() * height : -10;
          this.size = Math.random() * 2.0 + 0.8; // 0.8px to 2.8px
          this.speedY = Math.random() * 0.55 + 0.3; // Steady gentle fall
          this.speedX = (Math.random() - 0.5) * 0.25;
          this.swingAmp = Math.random() * 1.2 + 0.5;
          this.swingFreq = Math.random() * 0.015 + 0.005;
          this.angle = Math.random() * Math.PI * 2;

          if (isLightScreen()) {
            // Cozy-lavender screens: soft white with a light-purple glow,
            // boosted opacity so it reads clearly against the pastel bg.
            this.opacity = Math.random() * 0.35 + 0.55; // 0.55 to 0.9
            this.size = Math.random() * 2.6 + 1.4; // 1.4px to 4px
            const hueChoice = Math.random();
            this.color = hueChoice > 0.6
              ? `rgba(122, 94, 160, ${this.opacity * 0.8})` // Lavender fleck
              : `rgba(255, 255, 255, ${this.opacity})`; // Bright snow
          } else {
            this.opacity = Math.random() * 0.45 + 0.2; // 0.2 to 0.65
            // Color palette: Ethereal crisp white, warm starlight gold, soft cyan
            const hueChoice = Math.random();
            if (hueChoice > 0.85) {
              this.color = `rgba(232, 201, 122, ${this.opacity})`; // Gold starlight
            } else if (hueChoice > 0.70) {
              this.color = `rgba(78, 205, 196, ${this.opacity})`; // Cyan stardust
            } else {
              this.color = `rgba(240, 246, 255, ${this.opacity})`; // Soft white snow
            }
          }
        }
        update() {
          this.angle += this.swingFreq;
          this.x += Math.sin(this.angle) * this.swingAmp * 0.3 + this.speedX;
          this.y += this.speedY;

          // Gently push away from the cursor when it comes near.
          if (mouseX !== null) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const radius = 90;
            if (dist < radius) {
              const force = (radius - dist) / radius;
              this.x += (dx / dist) * force * 3.2;
              this.y += (dy / dist) * force * 3.2;
            }
          }

          // Wrap around bounds
          if (this.y > height + 10) this.reset(false);
          if (this.x > width + 10) this.x = -5;
          if (this.x < -10) this.x = width + 5;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = this.size > 1.8 ? 4 : 0;
          ctx.shadowColor = this.color;
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Snowflake());
      }

      function handleResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', handleResize);

      function render() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    })();
