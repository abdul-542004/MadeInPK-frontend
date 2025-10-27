import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Palette, Scissors, Hammer, Sparkles } from "lucide-react";
import { AnimatedTimeline } from "./AnimatedTimeline";

interface HeritagePageProps {
  onNavigate?: (page: string) => void;
}

export function HeritagePage({ onNavigate }: HeritagePageProps) {
  const timelineData = [
    {
      period: "3300 - 1300 BCE",
      title: "Indus Valley Civilization",
      description: "The roots of Pakistani craftsmanship date back to one of the world's oldest civilizations, where artisans created sophisticated pottery, jewelry, and textiles that still inspire modern craftspeople.",
      details: [
        "Advanced pottery techniques with geometric patterns and naturalistic designs",
        "Intricate bead-making and jewelry craftsmanship using precious stones",
        "Early textile dyeing and weaving methods discovered in archaeological sites",
        "Sophisticated metallurgy for tools, weapons, and decorative objects",
        "Urban planning and architectural innovations in cities like Mohenjo-daro"
      ],
      image: "https://images.unsplash.com/photo-1727962861627-017ade9234f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaW5kdXMlMjB2YWxsZXklMjBjaXZpbGl6YXRpb258ZW58MXx8fHwxNzYxMDUxMTExfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      period: "1526 - 1857 CE",
      title: "Mughal Empire - The Golden Age",
      description: "The Mughal period brought Persian and Central Asian influences, transforming Pakistani crafts into world-renowned art forms. This era established the foundation for many traditional crafts still practiced today.",
      details: [
        "Introduction of intricate carpet weaving techniques from Persia",
        "Development of miniature painting and manuscript illumination",
        "Advancement in textile arts including embroidery and brocade work",
        "Architectural crafts: marble inlay work, stone carving, and calligraphy",
        "Royal patronage elevated craftsmen to artist status across the empire"
      ],
      image: "https://images.unsplash.com/photo-1678304600824-3cd6f128f9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdoYWwlMjBlbXBpcmUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzYxMDUxMTExfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      period: "1858 - 1947 CE",
      title: "Colonial Era - Trade & Recognition",
      description: "British colonial rule brought Pakistani crafts to international markets. Despite challenges, artisans adapted and thrived, with their work gaining recognition at world exhibitions and trade fairs.",
      details: [
        "Pakistani textiles and carpets featured in major European exhibitions",
        "Establishment of craft schools and training centers across regions",
        "Export trade boosted demand for traditional handicrafts globally",
        "Documentation and preservation of traditional craft techniques",
        "Fusion of European and local design elements creating unique styles"
      ],
      image: "https://images.unsplash.com/photo-1644879796970-54b3ec078fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbmlhbCUyMGVyYSUyMHZpbnRhZ2V8ZW58MXx8fHwxNzYxMDUxMTEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      period: "1947 - Present",
      title: "Modern Pakistan - Revival & Innovation",
      description: "Contemporary Pakistani artisans honor ancient traditions while embracing innovation. Today's craftspeople blend time-honored techniques with modern design, creating pieces that resonate globally while preserving cultural heritage.",
      details: [
        "Digital platforms connecting artisans directly with global customers",
        "Government initiatives supporting traditional crafts and artisan communities",
        "Contemporary designers collaborating with traditional craftspeople",
        "Sustainable practices and fair trade movements empowering artisans",
        "Pakistani crafts featured in international fashion and design shows"
      ],
      image: "https://images.unsplash.com/photo-1710888451601-9885aeb8afe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnRpc2FuJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYxMDUwNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const crafts = [
    {
      title: "Truck Art",
      region: "Punjab & Sindh",
      description: "A vibrant and colorful art form adorning vehicles with intricate patterns, floral motifs, and Islamic calligraphy. This unique Pakistani tradition transforms ordinary trucks into mobile works of art.",
      image: "https://images.unsplash.com/photo-1725352566730-6e4ce995aebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYWtpc3RhbmklMjB0cnVjayUyMGFydCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MTA0OTEwOXww&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Palette,
    },
    {
      title: "Traditional Embroidery",
      region: "Sindh, Balochistan & Punjab",
      description: "Exquisite hand embroidery featuring mirror work, thread work, and intricate patterns. Each region has its distinct style - from Sindhi embroidery to Balochi needlework.",
      image: "https://images.unsplash.com/photo-1619328147198-aa1477637a21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGVtYnJvaWRlcnklMjBwYXR0ZXJufGVufDF8fHx8MTc2MTA0OTExMXww&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Scissors,
    },
    {
      title: "Carpet Weaving",
      region: "Lahore & Multan",
      description: "Hand-knotted carpets and rugs showcasing centuries-old techniques. Pakistani carpets are renowned worldwide for their quality, intricate designs, and vibrant colors.",
      image: "https://images.unsplash.com/photo-1718703357717-eb7c03f1a77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZXQlMjB3ZWF2aW5nJTIwbG9vbXxlbnwxfHx8fDE3NjEwNDkxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Sparkles,
    },
    {
      title: "Metalwork",
      region: "Wazirabad & Sialkot",
      description: "Masterful metalwork including copper crafts, brass items, and intricate silver jewelry. These artisans create everything from decorative pieces to functional items with stunning detail.",
      image: "https://images.unsplash.com/photo-1760637626047-006f662074d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG1ldGFsd29yayUyMGNyYWZ0c3xlbnwxfHx8fDE3NjEwNDkxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Hammer,
    },
  ];

  const timeline = [
    {
      period: "Ancient Era",
      title: "Indus Valley Civilization",
      description: "The roots of Pakistani craftsmanship date back to the Indus Valley Civilization (3300-1300 BCE), known for pottery, bead-making, and metallurgy.",
    },
    {
      period: "Mughal Period",
      title: "Golden Age of Crafts",
      description: "The Mughal Empire (1526-1857) brought Persian influences, elevating textile arts, carpet weaving, and miniature painting to new heights.",
    },
    {
      period: "Colonial Era",
      title: "Trade & Export",
      description: "British colonial period saw Pakistani crafts gain international recognition, with textiles and carpets exported globally.",
    },
    {
      period: "Modern Era",
      title: "Revival & Innovation",
      description: "Contemporary artisans blend traditional techniques with modern designs, keeping heritage alive while meeting contemporary tastes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-800 to-emerald-600 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-6">Pakistani Heritage</h1>
          <p className="text-xl max-w-3xl mx-auto text-emerald-50">
            Discover the rich tapestry of Pakistani craftsmanship spanning thousands of years
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl text-gray-900 mb-6">A Legacy of Excellence</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Pakistan's cultural heritage is woven into every handcrafted piece, telling stories of ancient civilizations, royal patronage, and generations of skilled artisans. From the banks of the Indus River to the valleys of the Himalayas, each region contributes its unique artistic traditions to the rich mosaic of Pakistani craftsmanship.
          </p>
        </div>

        {/* Traditional Crafts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {crafts.map((craft, index) => {
            const Icon = craft.icon;
            return (
              <div key={index} className="group">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6 shadow-lg">
                  <ImageWithFallback
                    src={craft.image}
                    alt={craft.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <Icon className="h-6 w-6 text-emerald-700" />
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-2xl text-gray-900">{craft.title}</h3>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs mt-1">
                    {craft.region}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {craft.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Timeline Section */}
      <AnimatedTimeline items={timelineData} />

      {/* Regional Crafts Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4">Crafts by Region</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each province of Pakistan has its own distinct artistic traditions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Punjab */}
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg border-2 border-emerald-100">
            <h3 className="text-xl text-gray-900 mb-3">Punjab</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Truck Art</li>
              <li>• Phulkari Embroidery</li>
              <li>• Blue Pottery</li>
              <li>• Carpet Weaving</li>
            </ul>
          </div>

          {/* Sindh */}
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg border-2 border-emerald-100">
            <h3 className="text-xl text-gray-900 mb-3">Sindh</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Ajrak Textile</li>
              <li>• Rilli Work</li>
              <li>• Lacquer Work</li>
              <li>• Block Printing</li>
            </ul>
          </div>

          {/* Balochistan */}
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg border-2 border-emerald-100">
            <h3 className="text-xl text-gray-900 mb-3">Balochistan</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Mirror Embroidery</li>
              <li>• Tribal Jewelry</li>
              <li>• Rug Weaving</li>
              <li>• Pottery</li>
            </ul>
          </div>

          {/* KPK */}
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg border-2 border-emerald-100">
            <h3 className="text-xl text-gray-900 mb-3">Khyber Pakhtunkhwa</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Chappal Making</li>
              <li>• Wood Carving</li>
              <li>• Gemstone Cutting</li>
              <li>• Shawl Weaving</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Preserve Our Heritage</h2>
          <p className="text-xl text-emerald-50 mb-8">
            Support Pakistani artisans and keep these ancient traditions alive for future generations
          </p>
          <button 
            onClick={() => onNavigate && onNavigate("products")}
            className="px-8 py-3 bg-white text-emerald-700 rounded-md hover:bg-emerald-50 transition-colors"
          >
            Explore Our Collection
          </button>
        </div>
      </div>
    </div>
  );
}
