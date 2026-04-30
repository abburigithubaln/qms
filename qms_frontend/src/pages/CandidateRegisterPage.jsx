import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Mail, Phone, MapPin, Briefcase,
    ClipboardList, CheckCircle2, ArrowRight,
    Hash, Clock, Users
} from 'lucide-react'
import axios from 'axios'

const EMPTY = {
    fullName: '', mobileNumber: '', email: '',
    currentLocation: '', applyingPosition: '', purposeOfVisit: ''
}

export default function CandidateRegisterPage() {
    const [step, setStep] = useState('form')
    const [form, setForm] = useState(EMPTY)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = {
                fullName: form.fullName.trim(),
                mobileNumber: form.mobileNumber.trim(),
                email: form.email.trim(),
                currentLocation: form.currentLocation?.trim(),
                applyingPosition: form.applyingPosition?.trim(),
                purposeOfVisit: form.purposeOfVisit?.trim()
            }
            const fd = new FormData()
            Object.entries(data).forEach(([k, v]) => {
                if (v) fd.append(k, v)
            })
            const res = await axios.post('/api/public/candidates/register', fd)
            setResult(res.data.data)
            setStep('success')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6">

            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-50 blur-[120px] opacity-60" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-50 blur-[120px] opacity-40" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-600/25 mb-4">
                        <Users size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-black tracking-tight">Candidate Registration</h1>
                    <p className="text-gray-400 text-sm mt-1">Fill in your details to get a queue token</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-100/60 overflow-hidden"
                        >
                            <div className="h-1.5 bg-teal-600 w-full" />

                            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Required Information</p>
                                    <div className="space-y-4">
                                        <Field icon={User} placeholder="Full Name" required value={form.fullName} onChange={set('fullName')} />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field icon={Phone} placeholder="Mobile Number" required type="tel" value={form.mobileNumber} onChange={set('mobileNumber')} pattern="^[6-9]\d{9}$" title="Enter valid 10-digit mobile number" />
                                            <Field icon={Mail} placeholder="Email Address" required type="email" value={form.email} onChange={set('email')} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Additional Details <span className="text-gray-300 font-normal normal-case">(optional)</span></p>
                                    <div className="space-y-4">
                                        <Field icon={MapPin} placeholder="Current Location" value={form.currentLocation} onChange={set('currentLocation')} />
                                        <Field icon={Briefcase} placeholder="Applying For (Position)" value={form.applyingPosition} onChange={set('applyingPosition')} />
                                        <Field icon={ClipboardList} placeholder="Purpose of Visit" value={form.purposeOfVisit} onChange={set('purposeOfVisit')} />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-teal-600/25 hover:bg-teal-700 transition-all flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Get My Token</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>

                                <p className="text-center text-xs text-gray-400">
                                    Your information is only used for today's interview scheduling
                                </p>
                            </form>
                        </motion.div>
                    )}

                    {step === 'success' && result && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-100/60 overflow-hidden"
                        >
                            <div className="h-1.5 bg-emerald-500 w-full" />

                            <div className="p-6 sm:p-10">
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                                        className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-100"
                                    >
                                        <CheckCircle2 size={36} className="text-emerald-500" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-black">You're Registered!</h2>
                                    <p className="text-gray-400 text-sm mt-1">Please keep your token details handy</p>
                                </div>

                                <div className="bg-teal-600 rounded-2xl p-6 text-white text-center mb-6 shadow-xl shadow-teal-600/25 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="absolute rounded-full border border-white"
                                                style={{ width: 80 + i * 40, height: 80 + i * 40, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                                        ))}
                                    </div>
                                    <p className="text-teal-200 text-xs font-bold uppercase tracking-widest mb-2">Your Token</p>
                                    <p className="text-3xl font-black font-mono tracking-wider mb-1">{result.tokenId}</p>
                                    <p className="text-teal-200 text-xs">{result.status}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <StatCard icon={Hash} label="Queue #" value={`#${result.queueNumber}`} />
                                    <StatCard icon={Users} label="Ahead" value={result.candidatesAhead} />
                                    <StatCard icon={Clock} label="Est. Wait" value={`~${result.estimatedWaitMinutes}m`} />
                                </div>

                                <div className="bg-teal-50 rounded-2xl p-5 text-center mb-2 border border-teal-100">
                                    <p className="text-sm text-teal-800 font-bold leading-relaxed">
                                        You will receive an email notification when the interviewer calls you. 
                                        Please ensure you are available near the assigned cabin.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

                <p className="text-center text-gray-300 mt-8 text-xs">
                    &copy; {new Date().getFullYear()} QMS · Queue Management System
                </p>
            </motion.div>
        </div>
    )
}

function Field({ icon: Icon, placeholder, value, onChange, required, type = 'text', pattern, title }) {
    return (
        <div className="relative">
            <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder + (required ? ' *' : '')}
                pattern={pattern}
                title={title}
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
            />
        </div>
    )
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
            <Icon size={16} className="text-teal-600 mx-auto mb-1" />
            <p className="text-lg font-black text-black">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    )
}