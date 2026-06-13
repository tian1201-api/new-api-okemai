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
import { ArrowRight, BarChart3, BookOpen, KeyRound, ShieldCheck, WalletCards } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStatus } from '@/hooks/use-status'
import { Button } from '@/components/ui/button'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

const metrics = [
  ['50+', 'upstream services'],
  ['100+', 'model billing rules'],
  ['API', 'OpenAI compatible'],
]

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'

  const renderDocsButton = () => {
    if (docsUrl.startsWith('http')) {
      return (
        <Button
          variant='outline'
          className='okemai-button-secondary h-11 rounded-lg px-5 text-sm font-bold'
          render={<a href={docsUrl} target='_blank' rel='noopener noreferrer' />}
        >
          <BookOpen className='mr-2 size-4' />
          {t('Docs')}
        </Button>
      )
    }

    return (
      <Button
        variant='outline'
        className='okemai-button-secondary h-11 rounded-lg px-5 text-sm font-bold'
        render={<Link to={docsUrl} />}
      >
        <BookOpen className='mr-2 size-4' />
        {t('Docs')}
      </Button>
    )
  }

  return (
    <section className='okemai-surface relative z-10 overflow-hidden px-6 pt-24 pb-14 md:pt-32 md:pb-20 lg:pt-36'>
      <div className='absolute inset-x-0 top-0 h-px bg-white/10' aria-hidden />
      <div className='mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12'>
        <div className='lg:col-span-7'>
          <div className='okemai-chip landing-animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black opacity-0'>
            <span className='size-1.5 rounded-full bg-[#58c7b8]' />
            {t('New API powered okemai gateway')}
          </div>

          <h1
            className='landing-animate-fade-up max-w-3xl text-[clamp(2.5rem,5vw,4.6rem)] leading-[1.02] font-black tracking-tight text-white opacity-0'
            style={{ animationDelay: '60ms' }}
          >
            OKEMAI
            <span className='block bg-gradient-to-r from-[#58c7b8] via-[#6fa8ff] to-[#a98bff] bg-clip-text text-transparent'>
              One Key, Every Model AI
            </span>
          </h1>

          <p
            className='landing-animate-fade-up mt-6 max-w-2xl text-base leading-relaxed text-[#95a2b6] opacity-0 md:text-lg'
            style={{ animationDelay: '120ms' }}
          >
            {t('Keep the okemai storefront experience while New API continues to power registration, login, wallet, tokens, channels, billing, permissions, and usage analytics.')}
          </p>

          <div
            className='landing-animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0'
            style={{ animationDelay: '180ms' }}
          >
            {props.isAuthenticated ? (
              <>
                <Button className='okemai-button-primary group h-11 rounded-lg px-5 text-sm' render={<Link to='/dashboard' />}>
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button variant='outline' className='okemai-button-secondary h-11 rounded-lg px-5 text-sm font-bold' render={<Link to='/wallet' />}>
                  <WalletCards className='mr-2 size-4' />
                  {t('Wallet')}
                </Button>
                {renderDocsButton()}
              </>
            ) : (
              <>
                <Button className='okemai-button-primary group h-11 rounded-lg px-5 text-sm' render={<Link to='/sign-up' />}>
                  {t('Create account')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button variant='outline' className='okemai-button-secondary h-11 rounded-lg px-5 text-sm font-bold' render={<Link to='/sign-in' />}>
                  {t('Sign in')}
                </Button>
                <Button variant='outline' className='okemai-button-secondary h-11 rounded-lg px-5 text-sm font-bold' render={<Link to='/pricing' />}>
                  {t('View Pricing')}
                </Button>
              </>
            )}
          </div>

          <div
            className='landing-animate-fade-up mt-10 grid max-w-xl grid-cols-3 gap-3 opacity-0'
            style={{ animationDelay: '240ms' }}
          >
            {metrics.map(([value, label]) => (
              <div key={label} className='okemai-panel px-4 py-3'>
                <strong className='block text-xl font-black text-white'>{value}</strong>
                <span className='text-xs text-[#95a2b6]'>{t(label)}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className='landing-animate-fade-up lg:col-span-5 opacity-0'
          style={{ animationDelay: '320ms' }}
        >
          <div className='okemai-panel p-5'>
            <div className='mb-5 flex items-center justify-between border-b border-white/10 pb-4'>
              <div className='flex items-center gap-3'>
                <span className='okemai-mark size-11'>ok</span>
                <div>
                  <strong className='block text-white'>OKEMAI Console</strong>
                  <span className='text-xs text-[#95a2b6]'>New API native controls</span>
                </div>
              </div>
              <span className='rounded-lg bg-[#58c7b8]/15 px-2.5 py-1 text-xs font-black text-[#8ee2d5]'>Live</span>
            </div>

            <div className='grid gap-3'>
              {[
                [KeyRound, t('Create and rotate API tokens'), '/keys'],
                [WalletCards, t('Recharge balance and redeem codes'), '/wallet'],
                [BarChart3, t('Review API call statistics'), '/usage-logs'],
                [ShieldCheck, t('Keep admin, channel, and permission systems intact'), '/channels'],
              ].map(([Icon, label, path]) => (
                <Button
                  key={String(path)}
                  variant='outline'
                  className='okemai-button-secondary h-auto justify-start rounded-lg px-4 py-4 text-left'
                  render={<Link to={props.isAuthenticated ? String(path) : '/sign-in'} />}
                >
                  <Icon className='mr-3 size-5 shrink-0 text-[#58c7b8]' />
                  <span className='text-sm font-bold'>{String(label)}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
