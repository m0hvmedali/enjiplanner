import { StudyPlan } from './types';

export const INITIAL_PLAN: StudyPlan = {
  subjects: {
    english: {
      id: 'english',
      name: 'اللغة الإنجليزية',
      color: 'bg-blue-900',
      accentColor: 'border-blue-500',
      description: 'رحلة في عالم اللغة - كلمات، قواعد، وقصة.',
      heroImage: 'https://picsum.photos/id/366/1200/600',
      tasks: [
        {
          id: 'eng_1',
          title: 'كلمات أول درسين',
          duration: '30 دقيقة',
          content: 'حفظ الكلمات + النطق',
          method: 'ربط الكلمة بصورة/موقف',
          feelingAfter: 'إن البداية سهلة ومش مخيفة',
          isCompleted: false,
          imageUrl: 'https://picsum.photos/seed/eng1/800/400'
        },
        {
          id: 'eng_2',
          title: 'حل على الكلمات',
          duration: '20 دقيقة',
          content: 'MCQ + جمل',
          method: 'تثبيت مش حفظ',
          feelingAfter: 'ثقة في الحفظ',
          isCompleted: false,
          imageUrl: 'https://picsum.photos/seed/eng2/800/400'
        },
        {
          id: 'eng_3',
          title: 'جرامر الوحدة',
          duration: '35 دقيقة',
          content: 'الفكرة العامة + أمثلة',
          method: 'خريطة ذهنية',
          feelingAfter: 'فهم القاعدة ككل',
          isCompleted: false,
          imageUrl: 'https://picsum.photos/seed/eng3/800/400'
        },
        {
          id: 'eng_4',
          title: 'حل على الجرامر',
          duration: '25 دقيقة',
          content: 'حل تمارين متنوعة',
          method: 'كشف الغلطات',
          feelingAfter: 'احتراف الحل',
          isCompleted: false,
          imageUrl: 'https://picsum.photos/seed/eng4/800/400'
        },
        {
          id: 'eng_5',
          title: 'قصة الإنجليزي',
          duration: '30 دقيقة',
          content: 'قراءة الفصل المقرر',
          method: 'قراءة قصصية مش دراسية',
          feelingAfter: 'الاستمتاع بالأحداث',
          isCompleted: false,
          imageUrl: 'https://picsum.photos/seed/eng5/800/400'
        }
      ]
    },
    arabic: {
      id: 'arabic',
      name: 'اللغة العربية',
      color: 'bg-emerald-900',
      accentColor: 'border-emerald-500',
      description: 'مراجعة النحو الشاملة بأسلوب ممتع.',
      heroImage: 'https://picsum.photos/id/234/1200/600',
      sections: [
        {
          title: 'الوحدة الثانية',
          tasks: [
            {
              id: 'arb_2_1',
              title: 'المشتقات العاملة',
              duration: '30 دقيقة',
              content: 'اسم الفاعل – اسم المفعول – صيغة المبالغة',
              method: 'جدول مقارنة + أمثلة',
              feelingAfter: 'القدرة على التمييز',
              isCompleted: false,
              imageUrl: 'https://picsum.photos/seed/arb1/800/400'
            },
            {
              id: 'arb_2_2',
              title: 'المشتقات غير العاملة',
              duration: '30 دقيقة',
              content: 'أسلوب التفضيل – اسم الآلة – الزمان والمكان',
              method: 'رسومات تطبيقية',
              feelingAfter: 'الإلمام بالصيغ',
              isCompleted: false,
              imageUrl: 'https://picsum.photos/seed/arb2/800/400'
            },
            {
              id: 'arb_2_3',
              title: 'المصادر',
              duration: '25 دقيقة',
              content: 'المصادر الصريحة والمؤولة',
              method: 'تحويل فعل → مصدر',
              feelingAfter: 'سهولة الاستخراج',
              isCompleted: false,
              imageUrl: 'https://picsum.photos/seed/arb3/800/400'
            },
            {
              id: 'arb_2_4',
              title: 'مكملات الوحدة الثانية',
              duration: '35 دقيقة',
              content: 'اسم الهيئة – اسم المرة – المقصور – الممدود – المنقوص',
              method: 'خريطة كبيرة',
              feelingAfter: 'اكتمال الوحدة',
              isCompleted: false,
              imageUrl: 'https://picsum.photos/seed/arb4/800/400'
            }
          ]
        },
        {
          title: 'الوحدة الرابعة',
          tasks: [
            { id: 'arb_4_1', title: 'المفاعيل (1)', duration: '30 دقيقة', content: 'المفعول به – المفعول فيه', feelingAfter: 'ضبط الجملة', isCompleted: false },
            { id: 'arb_4_2', title: 'المفاعيل (2)', duration: '30 دقيقة', content: 'المطلق – لأجله – معه', feelingAfter: 'التمكن من المنصوبات', isCompleted: false },
            { id: 'arb_4_3', title: 'الحال والتمييز', duration: '25 دقيقة', content: 'الفرق بين الحال والتمييز', feelingAfter: 'الدقة في الإعراب', isCompleted: false },
            { id: 'arb_4_4', title: 'الاستثناء والأسماء الخمسة', duration: '30 دقيقة', content: 'أحكام المستثنى', feelingAfter: 'إتقان الأدوات', isCompleted: false }
          ]
        },
        {
          title: 'الوحدة السادسة',
          tasks: [
            { id: 'arb_6_1', title: 'كم وحروف الجر', duration: '30 دقيقة', content: 'كم الاستفهامية والخبرية', feelingAfter: 'فهم الأدوات', isCompleted: false },
            { id: 'arb_6_2', title: 'أسلوب النداء', duration: '20 دقيقة', content: 'أنواع المنادى', feelingAfter: 'سهولة المناداة', isCompleted: false },
            { id: 'arb_6_3', title: 'أنواع ما - من - لا', duration: '25 دقيقة', content: 'التفرقة بين الحروف', feelingAfter: 'عدم اللبس', isCompleted: false }
          ]
        },
        {
          title: 'الوحدة السابعة',
          tasks: [
            { id: 'arb_7_1', title: 'الممنوع من الصرف', duration: '30 دقيقة', content: 'العلل والموانع', feelingAfter: 'إتقان الممنوع', isCompleted: false },
            { id: 'arb_7_2', title: 'الأساليب', duration: '30 دقيقة', content: 'المدح – الذم – الاختصاص – التعجب', feelingAfter: 'تنوع الأساليب', isCompleted: false },
            { id: 'arb_7_3', title: 'التوابع', duration: '35 دقيقة', content: 'النعت – العطف – التوكيد – البدل', feelingAfter: 'ضبط التوابع', isCompleted: false },
            { id: 'arb_7_4', title: 'الملحقات والكشف', duration: '25 دقيقة', content: 'المعجم وأسماء الأفعال', feelingAfter: 'ختام النحو', isCompleted: false }
          ]
        }
      ]
    },
    chemistry: {
      id: 'chemistry',
      name: 'الكيمياء',
      color: 'bg-purple-900',
      accentColor: 'border-purple-500',
      description: 'مراجعة مكثفة للفصل الرابع - الكيمياء الكهربية.',
      heroImage: 'https://picsum.photos/id/400/1200/600',
      tasks: [
        { id: 'chem_1', title: 'مراجعة الدرس الأول', duration: '25 دقيقة', content: 'الخلايا الجلفانية', feelingAfter: 'استرجاع الأساسيات', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem1/800/400' },
        { id: 'chem_2', title: 'حل الدرس الأول', duration: '20 دقيقة', content: 'تطبيقات الخلايا', feelingAfter: 'تثبيت المعلومة', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem2/800/400' },
        { id: 'chem_3', title: 'مراجعة الدرس الثاني', duration: '25 دقيقة', content: 'سلسلة الجهود', feelingAfter: 'فهم الترتيب', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem3/800/400' },
        { id: 'chem_4', title: 'حل الدرس الثاني', duration: '20 دقيقة', content: 'مسائل ق د ك', feelingAfter: 'حل المسائل', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem4/800/400' },
        { id: 'chem_5', title: 'مراجعة الدرس الثالث', duration: '25 دقيقة', content: 'الخلايا الإلكتروليتية', feelingAfter: 'فهم التحليل', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem5/800/400' },
        { id: 'chem_6', title: 'حل الدرس الثالث', duration: '20 دقيقة', content: 'تطبيقات التحليل', feelingAfter: 'الربط بالواقع', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem6/800/400' },
        { id: 'chem_7', title: 'مراجعة الدرس الرابع', duration: '25 دقيقة', content: 'قوانين فاراداي', feelingAfter: 'التمكن الرياضي', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem7/800/400' },
        { id: 'chem_8', title: 'حل الدرس الرابع', duration: '20 دقيقة', content: 'مسائل القوانين', feelingAfter: 'إنجاز الفصل', isCompleted: false, imageUrl: 'https://picsum.photos/seed/chem8/800/400' },
      ]
    },
    physics: {
      id: 'physics',
      name: 'الفيزياء',
      color: 'bg-rose-900',
      accentColor: 'border-rose-500',
      description: 'الحث الكهرومغناطيسي والتيار المتردد.',
      heroImage: 'https://picsum.photos/id/530/1200/600',
      sections: [
        {
          title: 'الفصل الثالث',
          tasks: [
            { id: 'phys_3_1', title: 'قانون فاراداي', duration: '30 دقيقة', content: 'القاعدة والقانون', feelingAfter: 'بداية الحث', isCompleted: false },
            { id: 'phys_3_2', title: 'حل على فاراداي', duration: '25 دقيقة', content: 'مسائل وتطبيقات', feelingAfter: 'الفهم العميق', isCompleted: false },
            { id: 'phys_3_3', title: 'الحث الذاتي والمتبادل', duration: '30 دقيقة', content: 'التجارب والقوانين', feelingAfter: 'الربط بين الملفات', isCompleted: false },
            { id: 'phys_3_4', title: 'حل على الحث', duration: '25 دقيقة', content: 'مسائل بيانية', feelingAfter: 'تحليل الرسوم', isCompleted: false },
            { id: 'phys_3_5', title: 'ق د ك سلك مستقيم', duration: '20 دقيقة', content: 'القوة الدافعة في سلك', feelingAfter: 'فهم الحركة', isCompleted: false },
            { id: 'phys_3_6', title: 'حل على السلك', duration: '20 دقيقة', content: 'قاعدة فليمنج', feelingAfter: 'تحديد الاتجاهات', isCompleted: false },
            { id: 'phys_3_7', title: 'الأجهزة', duration: '30 دقيقة', content: 'الدينامو – المحرك – المحول', feelingAfter: 'تطبيقات الحياة', isCompleted: false },
            { id: 'phys_3_8', title: 'حل على الأجهزة', duration: '25 دقيقة', content: 'مسائل متنوعة', feelingAfter: 'ختام الفصل', isCompleted: false },
          ]
        },
        {
          title: 'الفصل الرابع',
          tasks: [
            { id: 'phys_4_1', title: 'مراجعة الفصل الرابع', duration: 'أسبوع قادم', content: 'دوائر التيار المتردد', feelingAfter: 'الاستعداد', isCompleted: false }
          ]
        }
      ]
    },
    math: {
      id: 'math',
      name: 'الرياضيات (تفاضل)',
      color: 'bg-orange-900',
      accentColor: 'border-orange-500',
      description: 'سلوك الدوال ورسم المنحنيات.',
      heroImage: 'https://picsum.photos/id/20/1200/600',
      tasks: [
        { id: 'math_1', title: 'الدوال والمتباينات', duration: '30 دقيقة', content: 'تزايد وتناقص الدوال', feelingAfter: 'رؤية الدالة', isCompleted: false, imageUrl: 'https://picsum.photos/seed/math1/800/400' },
        { id: 'math_2', title: 'قراءة المنحنيات', duration: '25 دقيقة', content: 'استخراج المعلومات من الرسم', feelingAfter: 'قوة الملاحظة', isCompleted: false, imageUrl: 'https://picsum.photos/seed/math2/800/400' },
        { id: 'math_3', title: 'النقط الحرجة والانقلاب', duration: '30 دقيقة', content: 'شروط وجود النقط', feelingAfter: 'تحليل السلوك', isCompleted: false, imageUrl: 'https://picsum.photos/seed/math3/800/400' },
        { id: 'math_4', title: 'قراءة منحنيات (تطبيقي)', duration: '25 دقيقة', content: 'مسائل مركبة', feelingAfter: 'الربط بين المشتقات', isCompleted: false, imageUrl: 'https://picsum.photos/seed/math4/800/400' },
        { id: 'math_5', title: 'حل سنين سابقة', duration: '40 دقيقة', content: 'الباب الثاني تفاضل', feelingAfter: 'الثقة في الامتحان', isCompleted: false, imageUrl: 'https://picsum.photos/seed/math5/800/400' },
      ]
    }
  }
};