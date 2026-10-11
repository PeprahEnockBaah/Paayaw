import Link from 'next/link'
import Image from 'next/image'
import AboutTabs, { type AboutTab } from './about-tabs'
import { getLeaders, LEADER_GROUPS } from '@/lib/leaders'
import { getTenets } from '@/lib/tenets'

export const metadata = { title: 'About Us – Gideon Peprah Ministries' }

// Re-check at most once a minute; admin changes to Leadership and Tenets also refresh it immediately.
export const revalidate = 60


// How It Began is hidden for now. Set to true to bring it back as an extra tab.
// (Leadership is edited from /admin and shows by itself once a leader is added.)
const SHOW_HOW_IT_BEGAN = false

// Each section is a tab. Tenets of Faith fits on one laptop screen; The Prophet has room to read.
export default async function AboutPage() {
  const [leaders, tenets] = await Promise.all([getLeaders(), getTenets()])
  // Not squeezed to one screen: the bio gets room to read, with the photo as tall as the text.
  const prophet = (
    // Clips the photo where it reaches the edge of the screen on desktop.
    <div className="overflow-x-clip">
    <section className="page-container py-10 lg:py-14">
      {/* Desktop: bio on the left; the photo on the right is as tall as the bio, its top level with the heading,
          and may grow past the column into the empty space up to the screen edge. Phones: photo first, above the bio. */}
      <div className="grid grid-cols-1 lg:grid-cols-[6fr_5fr] xl:grid-cols-2 gap-10 xl:gap-14">
        <div className="relative flex justify-center lg:block lg:order-2">
          <Image
            src="/images/prophet-cutout.png"
            alt="Prophet Gideon Peprah"
            width={916}
            height={1254}
            priority
            className="lg:hidden w-full max-w-xs sm:max-w-sm h-auto drop-shadow-2xl"
          />
          <div
            className="hidden lg:block absolute inset-y-0 left-0"
            style={{ right: 'calc(-1 * (max(0px, (100vw - 72rem) / 2) + 0.5rem))' }}
          >
            <Image
              src="/images/prophet-cutout.png"
              alt="Prophet Gideon Peprah"
              fill
              sizes="50vw"
              className="object-contain object-left-top drop-shadow-2xl"
            />
          </div>
        </div>
        <div className="lg:order-1">
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
    </div>
  )

  const faith = (
    <section className="bg-paper py-6">
      <div className="page-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenets.length === 0 && (
          <p className="text-ink-muted md:col-span-2 lg:col-span-3 text-center py-6">Our tenets of faith will be published here soon.</p>
        )}
        {tenets.map((f) => (
          <div key={f.id} className="bg-white rounded-xl p-5 shadow-sm border-l-4" style={{ borderColor: 'var(--gold)' }}>
            <h3 className="font-heading font-bold text-lg mb-1.5 text-brand-main">{f.title}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )

  const howItBegan = (
    <section className="page-container py-8">
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

  // Leadership on the left, Staff on the right (stacked on phones). A group with no one in it is left out.
  const groups = LEADER_GROUPS.map((g) => ({ title: g, people: leaders.filter((l) => l.team === g) })).filter((g) => g.people.length)
  const leadership = (
    <section className="py-8 bg-brand-main">
      <div className={`page-container grid grid-cols-1 gap-10 ${groups.length > 1 ? 'lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-white/20' : ''}`}>
        {groups.map((g) => (
          <div key={g.title} className={groups.length > 1 ? 'lg:px-8 first:lg:pl-0 last:lg:pr-0' : ''}>
            <h3 className="font-heading text-2xl font-extrabold text-center mb-6" style={{ color: 'var(--gold-light)' }}>
              {g.title}
            </h3>
            <div className={`grid grid-cols-2 gap-x-6 gap-y-8 ${groups.length > 1 ? '' : 'sm:grid-cols-3 lg:grid-cols-4'}`}>
              {g.people.map((l) => (
                <div key={l.id} className="text-center">
                  <Image
                    src={l.image_url}
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
          </div>
        ))}
      </div>
    </section>
  )

  const tabs: AboutTab[] = [
    { id: 'prophet', label: 'The Prophet', content: prophet },
    { id: 'faith', label: 'Tenets of Faith', content: faith },
    ...(SHOW_HOW_IT_BEGAN ? [{ id: 'how-it-began', label: 'How It Began', content: howItBegan }] : []),
    ...(leaders.length ? [{ id: 'leadership', label: 'Leadership', content: leadership }] : []),
  ]

  return <AboutTabs tabs={tabs} />
}
