import Link from 'next/link'
import Image from 'next/image'
import AboutTabs, { type AboutTab } from './about-tabs'

export const metadata = { title: 'About Us – Gideon Peprah Ministries' }

const leaders = [
  { name: 'Elder Samuel Asante', role: 'Chairman, Governing Council', img: '/images/V_168.jpg' },
  { name: 'Mrs. Grace Boateng', role: 'Vice Chair', img: '/images/V_106.jpg' },
  { name: 'Deacon James Mensah', role: 'Secretary', img: '/images/V_107.jpg' },
  { name: 'Dr. Abena Osei', role: 'Treasurer', img: '/images/V_108.jpg' },
]

const beliefs = [
  { title: 'The Bible', body: 'We believe the Holy Bible is the inspired, infallible Word of God and the supreme authority in all matters of faith and conduct.' },
  { title: 'The Trinity', body: 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.' },
  { title: 'Jesus Christ', body: 'We believe in the deity of our Lord Jesus Christ, His virgin birth, sinless life, atoning death, bodily resurrection, and His imminent return.' },
  { title: 'Salvation', body: 'We believe that salvation is by grace through faith in Jesus Christ alone, and that all who repent and believe shall receive eternal life.' },
  { title: 'The Holy Spirit', body: 'We believe in the present ministry of the Holy Spirit, who empowers believers for life and service.' },
  { title: 'The Church', body: 'We believe in the universal Church, the Body of Christ, and the importance of Christian fellowship, worship, and discipleship.' },
]

// Only The Prophet and Statements of Faith are shown for now. Set to true to bring back
// How It Began and Leadership (as extra tabs).
const SHOW_FULL_ABOUT = false

// Each section is a tab. Statements of Faith fits on one laptop screen; The Prophet has room to read.
export default function AboutPage() {
  // Not squeezed to one screen: the bio gets room to read, with the photo as tall as the text.
  const prophet = (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      {/* Desktop: the photo stretches to the full height of the bio, so the two line up. */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] xl:grid-cols-2 gap-10 xl:gap-14">
        <div className="relative flex justify-center lg:block">
          <Image
            src="/images/prophet.png"
            alt="Prophet Gideon Peprah"
            width={1242}
            height={1266}
            priority
            className="w-full max-w-md h-auto mx-auto drop-shadow-2xl lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-auto lg:max-w-[calc(100%+3rem)] lg:mx-0 object-contain object-top xl:object-bottom"
          />
        </div>
        <div>
          <h2 className="font-heading text-3xl font-bold mb-2 text-brand-main normal-case">Prophet Gideon Peprah</h2>
          <p className="text-sm font-bold tracking-widest uppercase mb-6 text-brand-main">Founder &amp; President, GPM</p>
          <div className="space-y-3.5 text-[15px] leading-[1.75] text-ink-muted">
            <p>Gideon Peprah is a prophet of God, visionary ministry leader, and seasoned broadcast professional dedicated to releasing divine truth and setting standards of excellence across media and ministry.</p>
            <p>Born in Ghana and raised as a pastor&rsquo;s child within The Church of Pentecost, Gideon was formed in an environment of deep spiritual discipline and service. In January 2000, he received a life-defining supernatural encounter with God&mdash;an impartation that empowered him with prophetic grace and imparted the core vision for his life&rsquo;s work. Out of this encounter flowed the birth of Gideon Peprah Ministries and The Valor Gospel Church, both of which he serves as Founder and President, laboring to align lives, restore purpose, and equip believers for kingdom impact.</p>
            <p>Alongside his spiritual mantle, Gideon is a professionally trained sound engineer, radio and TV broadcast technician, and video editor. His technical career includes key media roles, notably serving as the sound engineer, video editor, and playout programmer for Champions TV in Abuja, Nigeria. Merging technical mastery with an entrepreneurial drive, he established Valor Multimedia, where he serves as Founder and CEO, delivering high-caliber digital solutions and event production services.</p>
            <p>Guided by a divine imperative to build, instruct, and transform, Gideon operates at the intersection of prophetic authority and media innovation. He is happily married and blessed with children.</p>
          </div>
          <Link href="/book-the-prophet" className="btn-primary inline-block mt-6">Book the Prophet</Link>
        </div>
      </div>
    </section>
  )

  const faith = (
    <section className="bg-paper px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beliefs.map((f) => (
          <div key={f.title} className="bg-white rounded-xl p-5 shadow-sm border-l-4" style={{ borderColor: 'var(--gold)' }}>
            <h3 className="font-heading font-bold text-lg mb-1.5 text-brand-main">{f.title}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )

  const howItBegan = (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 leading-[1.85] text-ink-muted">
          <p>Gideon Peprah Ministries (GPM) was founded out of a deep conviction to mobilise the Body of Christ and position God's people for the imminent return of our Lord Jesus Christ.</p>
          <p>What began as a small fellowship of believers united by a common passion for the Word of God has grown into a powerful ministry spanning multiple nations, reaching souls and transforming communities through the power of the Gospel.</p>
          <p>Over the years, GPM has expanded its reach through church planting, evangelism campaigns, education initiatives, and community development projects — all rooted in the uncompromising proclamation of the Gospel.</p>
          <p>Today, GPM stands as a beacon of hope, equipping and empowering believers to live out their faith in every sphere of society.</p>
        </div>
        <Image
          src="/images/Pastor.jpg"
          alt="Prophet Gideon Peprah"
          width={914}
          height={1280}
          className="w-full max-w-sm mx-auto rounded-xl shadow-2xl object-cover object-top"
          style={{ aspectRatio: '3/4' }}
        />
      </div>
    </section>
  )

  const leadership = (
    <section className="py-8 px-6 bg-brand-main">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {leaders.map((l) => (
          <div key={l.name} className="text-center">
            <Image
              src={l.img}
              alt={l.name}
              width={200}
              height={200}
              className="w-28 h-28 rounded-full mx-auto mb-4 object-cover object-top"
              style={{ border: '3px solid var(--gold)' }}
            />
            <h4 className="font-bold text-white text-base">{l.name}</h4>
            <p className="text-sm mt-1" style={{ color: 'var(--gold-light)' }}>{l.role}</p>
          </div>
        ))}
      </div>
    </section>
  )

  const tabs: AboutTab[] = [
    { id: 'prophet', label: 'The Prophet', content: prophet },
    { id: 'faith', label: 'Statements of Faith', content: faith },
    ...(SHOW_FULL_ABOUT
      ? [
          { id: 'how-it-began', label: 'How It Began', content: howItBegan },
          { id: 'leadership', label: 'Leadership', content: leadership },
        ]
      : []),
  ]

  return <AboutTabs tabs={tabs} />
}
