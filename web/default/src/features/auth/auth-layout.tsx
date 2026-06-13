/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Link } from '@tanstack/react-router'
import { KeyRound, ShieldCheck, WalletCards } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Skeleton } from '@/components/ui/skeleton'

type AuthLayoutProps = {
  children: React.ReactNode
}

type AuthFeature = {
  icon: LucideIcon
  label: string
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()
  const features: AuthFeature[] = [
    { icon: KeyRound, label: t('Real token creation and key management') },
    { icon: WalletCards, label: t('Native recharge, redemption, and payment flow') },
    { icon: ShieldCheck, label: t('Admin permissions and channel controls stay intact') },
  ]

  return (
    <div className='okemai-auth-shell relative grid min-h-svh max-w-none overflow-hidden lg:grid-cols-[minmax(0,1fr)_520px]'>
      <Link
        to='/'
        className='absolute top-4 left-4 z-10 flex items-center gap-3 transition-opacity hover:opacity-80 sm:top-8 sm:left-8'
      >
        <div className='relative h-10 w-10'>
          {loading ? (
            <Skeleton className='absolute inset-0 rounded-[10px]' />
          ) : logo ? (
            <img
              src={logo}
              alt={t('Logo')}
              className='h-10 w-10 rounded-[10px] object-cover'
            />
          ) : (
            <span className='okemai-mark h-10 w-10'>ok</span>
          )}
        </div>
        {loading ? (
          <Skeleton className='h-6 w-28' />
        ) : (
          <div>
            <h1 className='text-xl leading-none font-black text-white'>
              {systemName || 'OKEMAI'}
            </h1>
            <span className='text-xs text-[#95a2b6]'>One Key, Every Model AI</span>
          </div>
        )}
      </Link>

      <section className='hidden min-h-svh items-center px-10 pt-24 lg:flex'>
        <div className='max-w-xl'>
          <div className='okemai-chip mb-5 inline-flex rounded-full px-3 py-1.5 text-xs font-black'>
            {t('New API account system')}
          </div>
          <h2 className='text-4xl leading-tight font-black tracking-tight text-white xl:text-5xl'>
            OKEMAI portal, New API security and billing underneath.
          </h2>
          <p className='mt-5 text-base leading-relaxed text-[#95a2b6]'>
            {t('Use the original New API registration, login, wallet, permissions, token management, and usage statistics with an okemai visual skin.')}
          </p>

          <div className='mt-8 grid gap-3'>
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className='okemai-panel flex items-center gap-3 px-4 py-3'>
                <Icon className='size-5 shrink-0 text-[#58c7b8]' />
                <span className='text-sm font-bold text-[#d9e2ef]'>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className='flex min-h-svh items-center px-4 pt-24 pb-8 sm:px-8 lg:px-10 lg:pt-8'>
        <div className='okemai-auth-card mx-auto flex w-full max-w-[480px] flex-col justify-center space-y-2 p-6 sm:p-8'>
          {children}
        </div>
      </main>
    </div>
  )
}
