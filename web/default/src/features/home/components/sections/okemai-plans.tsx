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
import { ArrowRight, BadgeCheck, Gauge, KeyRound, WalletCards } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'

interface OkemaiPlansProps {
  isAuthenticated?: boolean
}

type Plan = {
  name: string
  provider: string
  price: string
  accentClass: string
  description: string
  features: string[]
}

type NativeFlow = {
  icon: LucideIcon
  text: string
  path: '/keys' | '/wallet' | '/usage-logs'
}

export function OkemaiPlans({ isAuthenticated }: OkemaiPlansProps) {
  const { t } = useTranslation()
  const actionTarget = isAuthenticated ? '/wallet' : '/sign-up'

  const plans: Plan[] = [
    {
      name: 'GPT Starter',
      provider: 'GPT',
      price: 'Starter',
      accentClass: 'okemai-plan-green',
      description: t('For light daily AI tasks and API experiments.'),
      features: [t('Use New API token management'), t('Recharge through wallet'), t('Track usage logs')],
    },
    {
      name: 'GPT Pro',
      provider: 'GPT',
      price: 'Pro',
      accentClass: 'okemai-plan-teal',
      description: t('For production apps that need stable routing and billing.'),
      features: [t('Create multiple API tokens'), t('Model pricing visibility'), t('Quota and cost accounting')],
    },
    {
      name: 'Claude Team',
      provider: 'Claude',
      price: 'Team',
      accentClass: 'okemai-plan-violet',
      description: t('For teams using Claude-compatible channels through New API.'),
      features: [t('Channel failover by admin rules'), t('Centralized permissions'), t('Usage analytics')],
    },
  ]

  const nativeFlows: NativeFlow[] = [
    { icon: KeyRound, text: t('Token creation uses New API native key management'), path: '/keys' },
    { icon: WalletCards, text: t('Recharge, redemption, and payment stay in New API wallet'), path: '/wallet' },
    { icon: Gauge, text: t('Usage and API call statistics stay in New API logs'), path: '/usage-logs' },
  ]

  return (
    <section className='okemai-surface relative z-10 overflow-hidden px-6 py-20 md:py-24'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-2xl'>
            <div className='okemai-chip mb-4 inline-flex rounded-full px-3 py-1.5 text-xs font-bold'>
              {t('OKEMAI Plans')}
            </div>
            <h2 className='text-2xl font-bold tracking-tight text-white md:text-4xl'>
              {t('Choose a plan, then complete recharge in New API')}
            </h2>
            <p className='mt-4 text-sm leading-relaxed text-[#95a2b6] md:text-base'>
              {t('These cards keep the okemai storefront style, while balance, payment, redemption, tokens, and billing remain powered by New API native flows.')}
            </p>
          </div>
          <Button
            variant='outline'
            className='okemai-button-secondary h-11 rounded-lg px-5'
            render={<Link to='/pricing' />}
          >
            {t('View model pricing')}
          </Button>
        </AnimateInView>

        <div className='grid gap-5 md:grid-cols-3'>
          {plans.map((plan) => (
            <AnimateInView key={plan.name} className={`okemai-plan-card ${plan.accentClass} p-6 pt-8`}>
              <div className='mb-5 flex items-start justify-between gap-4'>
                <div>
                  <span className='text-xs font-bold uppercase tracking-[0.16em] text-[#95a2b6]'>
                    {plan.provider}
                  </span>
                  <h3 className='mt-2 text-xl font-bold text-white'>{plan.name}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-[#95a2b6]'>
                    {plan.description}
                  </p>
                </div>
                <span className='rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm font-black text-white'>
                  {plan.price}
                </span>
              </div>

              <div className='mb-6 grid gap-3 rounded-lg bg-white/[0.04] p-4'>
                {plan.features.map((feature) => (
                  <div key={feature} className='flex items-center gap-2 text-sm text-[#d9e2ef]'>
                    <BadgeCheck className='size-4 shrink-0 text-[#58c7b8]' />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button className='okemai-button-primary group h-11 w-full rounded-lg' render={<Link to={actionTarget} />}>
                {isAuthenticated ? t('Recharge or buy in wallet') : t('Create account to buy')}
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
            </AnimateInView>
          ))}
        </div>

        <div className='mt-6 grid gap-4 md:grid-cols-3'>
          {nativeFlows.map(({ icon: Icon, text, path }) => (
            <Button
              key={path}
              variant='outline'
              className='okemai-button-secondary h-auto justify-start rounded-lg px-4 py-4 text-left text-sm'
              render={<Link to={isAuthenticated ? path : '/sign-in'} />}
            >
              <Icon className='mr-3 size-5 shrink-0 text-[#58c7b8]' />
              <span>{text}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
