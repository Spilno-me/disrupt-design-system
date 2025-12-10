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
  // Map icon colors to their darker border equivalents using DDS tokens
  const getBorderColor = (iconColor: string) => {
    if (iconColor.includes('circleYellow') || iconColor.includes('featureYellow')) return 'border-warning'
    if (iconColor.includes('circleGreen') || iconColor.includes('featureGreen')) return 'border-success'
    if (iconColor.includes('circleBlue') || iconColor.includes('featureBlue')) return 'border-info'
    return 'border-strong' // fallback - uses DDS border-strong token
  }
  
  return (
    <div className="flex flex-col items-center gap-5 flex-1" data-element={dataElement}>
      <div className={`w-24 h-24 border-2 border-dashed ${getBorderColor(iconColor)} rounded-full flex items-center justify-center`}>
        <div className={`${UI_CONSTANTS.ICON_SIZES.LARGE} rounded-full ${iconColor} flex items-center justify-center shadow-sm`}>
          <Icon className={`${UI_CONSTANTS.ICON_SIZES.MEDIUM} text-inverse`} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-center text-inverse">
          {title}
        </h3>
        <p className="text-base text-center leading-6 feature-description-text">
          {description}
        </p>
      </div>
    </div>
  )
}
