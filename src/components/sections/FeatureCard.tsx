import { LucideIcon } from 'lucide-react'
import { UI_CONSTANTS } from '@/constants/appConstants'

interface FeatureCardProps {
  icon: LucideIcon
  iconColor: string
  title: string
  description: string
  dataElement: string
}

export function FeatureCard({ icon: Icon, iconColor, title, description, dataElement }: FeatureCardProps) {
  // Map icon colors to their darker border equivalents
  const getBorderColor = (iconColor: string) => {
    if (iconColor.includes('yellow-400')) return 'border-yellow-600'
    if (iconColor.includes('green-500')) return 'border-green-700' 
    if (iconColor.includes('blue-600')) return 'border-blue-800'
    return 'border-gray-600' // fallback
  }
  
  return (
    <div className="flex flex-col items-center gap-5 flex-1" data-element={dataElement}>
      <div className={`w-24 h-24 border-2 border-dashed ${getBorderColor(iconColor)} rounded-full flex items-center justify-center`}>
        <div className={`${UI_CONSTANTS.ICON_SIZES.LARGE} rounded-full ${iconColor} flex items-center justify-center shadow-sm`}>
          <Icon className={`${UI_CONSTANTS.ICON_SIZES.MEDIUM} text-white`} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-center text-white">
          {title}
        </h3>
        <p className="text-base text-center leading-6 feature-description-text">
          {description}
        </p>
      </div>
    </div>
  )
}
