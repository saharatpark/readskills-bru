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
    }

    // ═══════════ MODULAR LESSON DETAIL & TOPIC VIEWER ═══════════
    let currentLessonUnit = 1;
    let currentTopicIndex = 0;
    const completedTopics = JSON.parse(localStorage.getItem('rs_completed_u1_topics') || '{}');

    function updateUnit1ProgressUI() {
      const total = 8;
      const doneCount = [1, 2, 3, 4, 5, 6, 7, 8].filter(k => completedTopics[k]).length;
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
        if (desc) desc.textContent = 'เรียนรู้ทฤษฎีพื้นฐาน Text Features, Topic Sentences, Main Ideas และคำศัพท์วิชาการ (Topic 1–6)';
      } else if (stageNum === 2) {
        cards1.forEach(c => c.style.display = 'none');
        cards2.forEach(c => c.style.display = 'flex');
        cards3.forEach(c => c.style.display = 'none');
        if (title) title.textContent = 'Stage 2: ระหว่างอ่าน (While-Reading) — ฝึกอ่านบทความจริง';
        if (desc) desc.textContent = 'ฝึกอ่านบทความ 5 เรื่อง (สั้น–ยาว) พร้อมไฮไลท์แบบ Interactive และแบบฝึกหัด ≥ 5 ข้อต่อเรื่อง (Topic 7)';
      } else if (stageNum === 3) {
        cards1.forEach(c => c.style.display = 'none');
        cards2.forEach(c => c.style.display = 'none');
        cards3.forEach(c => c.style.display = 'flex');
        if (title) title.textContent = 'Stage 3: หลังอ่าน (Post-Reading) — ทบทวนและประเมินผล';
        if (desc) desc.textContent = 'แบบทดสอบประเมินตนเอง 5 ข้อ เกณฑ์ Scoring Rubric และบันทึกสะท้อนการเรียนรู้ (Topic 8)';
      } else {
        // Show all
        cards1.forEach(c => c.style.display = 'flex');
        cards2.forEach(c => c.style.display = 'flex');
        cards3.forEach(c => c.style.display = 'flex');
        if (title) title.textContent = 'Unit 1: All Topics Overview (Pre + While + Post Reading)';
        if (desc) desc.textContent = 'แสดงหัวข้อบทเรียนทั้ง 8 ส่วนของ Unit 1 ครบทั้ง 3 ขั้นตอน';
      }
    }

    function switchReaderStage(stageNum) {
      if (stageNum === 1) openLessonTopic(1);
      else if (stageNum === 2) openLessonTopic(7);
      else if (stageNum === 3) openLessonTopic(8);
    }

    function updateReaderStageTabs(topicIdx) {
      let stage = 1;
      if (topicIdx === 7) stage = 2;
      else if (topicIdx === 8) stage = 3;

      for (let i = 1; i <= 3; i++) {
        const rTab = document.getElementById(`rst-tab-${i}`);
        if (rTab) rTab.classList.toggle('active', i === stage);
      }
    }

    function openLessonDetail(unitId) {
      if (unitId === 1) {
        currentLessonUnit = 1;
        document.getElementById('unit1-hub-view').style.display = 'block';
        document.getElementById('unit1-reader-view').classList.remove('active');
        updateUnit1ProgressUI();
        filterLessonStage(1);
        nav('screen-lesson-detail');
      } else {
        showToast(`🔒 Unit ${unitId} อยู่ในแผนการสอนสัปดาห์ถัดไป (กำลังโฟกัสที่ Lesson Plan 1)`);
      }
    }

    const TOPIC_NAMES = [
      'Overview',
      'Topic 1: ส่วนประกอบของบทความ (Text Features)',
      'Topic 2: ประโยคใจความสำคัญ (Topic Sentence)',
      'Topic 3: ใจความสำคัญหลัก (Main Idea)',
      'Topic 4: รายละเอียดและคำเชื่อม (Supporting Details)',
      'Topic 5: เปรียบเทียบ Main Idea vs. Details',
      'Topic 6: คำศัพท์วิชาการ (Vocabulary Preview)',
      'Topic 7: ฝึกอ่านบทความ A–E (While-Reading)',
      'Topic 8: แบบประเมินตนเอง (Post-Reading Quiz)'
    ];

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
      for (let i = 1; i <= 8; i++) {
        const pane = document.getElementById(`topic-pane-${i}`);
        if (pane) pane.style.display = (i === topicIdx) ? 'block' : 'none';
      }

      // Update prev / next buttons
      const prevBtn = document.getElementById('rfn-prev-btn');
      const nextBtn = document.getElementById('rfn-next-btn');
      if (prevBtn) prevBtn.style.visibility = (topicIdx <= 1) ? 'hidden' : 'visible';
      if (nextBtn) nextBtn.textContent = (topicIdx === 8) ? 'Finish Unit 1 🏁' : 'Next Topic ➔';

      // Mark as read/completed
      completedTopics[topicIdx] = true;
      localStorage.setItem('rs_completed_u1_topics', JSON.stringify(completedTopics));
      updateUnit1ProgressUI();

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
      if (nextIdx >= 1 && nextIdx <= 8) {
        openLessonTopic(nextIdx);
      } else if (nextIdx > 8) {
        showToast('🎉 ยินดีด้วย! คุณเรียนครบทุกหัวข้อใน Unit 1 เรียบร้อยแล้ว');
        closeLessonTopic();
      }
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
      } else {
        showToast(`Strategy ${unitId} guide is available in course materials.`);
      }
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
        update() {
          this.angle += this.swingFreq;
          this.x += Math.sin(this.angle) * this.swingAmp * 0.3 + this.speedX;
          this.y += this.speedY;

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
