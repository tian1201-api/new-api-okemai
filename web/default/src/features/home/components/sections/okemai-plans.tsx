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
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, Gauge, KeyRound, WalletCards } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getSelf } from '@/lib/api'
import { formatQuota } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'
import { SubscriptionPurchaseDialog } from '@/features/subscriptions/components/dialogs/subscription-purchase-dialog'
import { getPublicPlans } from '@/features/subscriptions/api'
import { formatDuration, formatResetPeriod } from '@/features/subscriptions/lib'
import type { PlanRecord } from '@/features/subscriptions/types'
import { getTopupInfo } from '@/features/wallet/api'
import type { PaymentMethod, TopupInfo, UserWalletData } from '@/features/wallet/types'

interface OkemaiPlansProps {
  isAuthenticated?: boolean
}

type NativeFlow = {
  icon: LucideIcon
  text: string
  path: '/keys' | '/wallet' | '/usage-logs'
}

const accentClasses = [
  'okemai-plan-green',
  'okemai-plan-teal',
  'okemai-plan-violet',
]

function getEpayMethods(payMethods: PaymentMethod[] = []): PaymentMethod[] {
  return payMethods.filter(
    (method) =>
      method?.type &&
      method.type !== 'stripe' &&
      method.type !== 'creem' &&
      method.type !== 'waffo-pancake'
  )
}

function parsePaymentMethods(raw: unknown): PaymentMethod[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (method): method is PaymentMethod =>
        !!method &&
        typeof method === 'object' &&
        typeof (method as PaymentMethod).type === 'string'
    )
  }
  if (typeof raw !== 'string') {
    return []
  }
  try {
    const parsed = JSON.parse(raw)
    return parsePaymentMethods(parsed)
  } catch {
    return []
  }
}

function normalizeTopupInfo(data: TopupInfo | null): TopupInfo | null {
  if (!data) return null
  return {
    ...data,
    pay_methods: parsePaymentMethods(data.pay_methods as unknown),
  }
}

export function OkemaiPlans({ isAuthenticated }: OkemaiPlansProps) {
  const { t } = useTranslation()
  const [plans, setPlans] = useState<PlanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanRecord | null>(null)
  const [topupInfo, setTopupInfo] = useState<TopupInfo | null>(null)
  const [userQuota, setUserQuota] = useState<number | undefined>()

  useEffect(() => {
    let alive = true
    const fetchPlans = async () => {
      setLoading(true)
      try {
        const res = await getPublicPlans()
        if (alive) {
          setPlans(res.success ? res.data || [] : [])
        }
      } catch {
        if (alive) setPlans([])
      } finally {
        if (alive) setLoading(false)
      }
    }

    void fetchPlans()
    window.addEventListener('focus', fetchPlans)
    return () => {
      alive = false
      window.removeEventListener('focus', fetchPlans)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setTopupInfo(null)
      setUserQuota(undefined)
      return
    }

    let alive = true
    const fetchUserPaymentContext = async () => {
      try {
        const [topupRes, selfRes] = await Promise.all([
          getTopupInfo(),
          getSelf(),
        ])
        if (!alive) return
        setTopupInfo(
          topupRes.success && topupRes.data
            ? normalizeTopupInfo(topupRes.data)
            : null
        )
        const self = selfRes.data as UserWalletData | undefined
        setUserQuota(Number(self?.quota || 0))
      } catch {
        if (!alive) return
        setTopupInfo(null)
        setUserQuota(undefined)
      }
    }

    void fetchUserPaymentContext()
    return () => {
      alive = false
    }
  }, [isAuthenticated])

  const nativeFlows: NativeFlow[] = [
    { icon: KeyRound, text: t('Token creation uses New API native key management'), path: '/keys' },
    { icon: WalletCards, text: t('Recharge, redemption, and payment stay in New API wallet'), path: '/wallet' },
    { icon: Gauge, text: t('Usage and API call statistics stay in New API logs'), path: '/usage-logs' },
  ]

  const epayMethods = useMemo(
    () => getEpayMethods(topupInfo?.pay_methods),
    [topupInfo?.pay_methods]
  )

  const openPurchase = (plan: PlanRecord) => {
    setSelectedPlan(plan)
    setPurchaseOpen(true)
  }

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

        {loading ? (
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <AnimateInView
                key={index}
                className='okemai-plan-card animate-pulse p-6 pt-8'
              >
                <div className='mb-5 h-6 w-24 rounded bg-white/10' />
                <div className='mb-3 h-8 w-32 rounded bg-white/10' />
                <div className='mb-6 h-20 rounded bg-white/[0.06]' />
                <div className='h-11 rounded-lg bg-white/10' />
              </AnimateInView>
            ))}
          </div>
        ) : plans.length > 0 ? (
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
            {plans.map((record, index) => {
              const plan = record.plan
              const totalAmount = Number(plan.total_amount || 0)
              const resetPeriod = formatResetPeriod(plan, t)
              const features = [
                `${t('Validity Period')}: ${formatDuration(plan, t)}`,
                totalAmount > 0
                  ? `${t('Total Quota')}: ${formatQuota(totalAmount)}`
                  : `${t('Total Quota')}: ${t('Unlimited')}`,
                resetPeriod !== t('No Reset')
                  ? `${t('Quota Reset')}: ${resetPeriod}`
                  : t('Native New API subscription billing'),
              ]
              const accentClass = accentClasses[index % accentClasses.length]

              return (
                <AnimateInView
                  key={plan.id}
                  className={`okemai-plan-card ${accentClass} p-6 pt-8`}
                >
                  <div className='mb-5 flex items-start justify-between gap-4'>
                    <div>
                      <span className='text-xs font-bold uppercase tracking-[0.16em] text-[#95a2b6]'>
                        {plan.currency || 'USD'}
                      </span>
                      <h3 className='mt-2 text-xl font-bold text-white'>
                        {plan.title}
                      </h3>
                      {plan.subtitle && (
                        <p className='mt-2 text-sm leading-relaxed text-[#95a2b6]'>
                          {plan.subtitle}
                        </p>
                      )}
                    </div>
                    <span className='rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm font-black text-white'>
                      ${Number(plan.price_amount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className='mb-6 grid gap-3 rounded-lg bg-white/[0.04] p-4'>
                    {features.map((feature) => (
                      <div key={feature} className='flex items-center gap-2 text-sm text-[#d9e2ef]'>
                        <BadgeCheck className='size-4 shrink-0 text-[#58c7b8]' />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isAuthenticated ? (
                    <Button
                      className='okemai-button-primary group h-11 w-full rounded-lg'
                      onClick={() => openPurchase(record)}
                    >
                      {t('Subscribe Now')}
                      <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                    </Button>
                  ) : (
                    <Button
                      className='okemai-button-primary group h-11 w-full rounded-lg'
                      render={<Link to='/sign-up' />}
                    >
                      {t('Create account to buy')}
                      <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                    </Button>
                  )}
                </AnimateInView>
              )
            })}
          </div>
        ) : (
          <AnimateInView className='okemai-plan-card p-6 text-center text-sm text-[#95a2b6]'>
            {t('No plans available')}
          </AnimateInView>
        )}

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

      <SubscriptionPurchaseDialog
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
        plan={selectedPlan}
        enableStripe={!!topupInfo?.enable_stripe_topup}
        enableCreem={!!topupInfo?.enable_creem_topup}
        enableWaffoPancake={!!topupInfo?.enable_waffo_pancake_topup}
        enableOnlineTopUp={!!topupInfo?.enable_online_topup}
        epayMethods={epayMethods}
        userQuota={userQuota}
      />
    </section>
  )
}
