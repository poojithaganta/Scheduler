import React, { useState } from 'react';
import TextInput from '../components/inputs/TextInput';
import FileInput from '../components/inputs/FileInput';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';

const OFFICES = [
  { label: 'Irving', value: 'irving' },
  { label: 'McKinney', value: 'mckinney' },
  { label: 'Santa Clara', value: 'santa-clara' },
  { label: 'Tampa', value: 'tampa' },
  { label: 'Pittsburgh', value: 'pittsburgh' },
];

export default function JobApplication() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [office, setOffice] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Mock nearest office based on address: choose the office whose name shares a word/letter
  const nearest = (() => {
    if (!address) return 'Irving';
    const lower = address.toLowerCase();
    const found = OFFICES.find(o => lower.includes(o.label.toLowerCase().split(' ')[0]));
    if (found) return found.label;
    const first = OFFICES.find(o => lower[0] && o.label[0].toLowerCase() === lower[0]);
    return first?.label ?? 'Irving';
  })();

  const options = OFFICES.map(o => ({...o, highlight: o.label === (office || nearest) }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container-px mx-auto py-10">
      <h2 className="text-2xl font-bold">Job Application</h2>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-2xl">
        <TextInput label="Name" value={name} onChange={e => setName(e.target.value)} required />
        <TextInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <TextInput label="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
        <TextInput label="Address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your address" required />
        <Dropdown
          label="Office Location"
          value={office || nearest}
          onChange={setOffice}
          options={options}
          placeholder="Select nearest office"
        />
        <FileInput label="Resume" onChange={e => setResume((e.target.files && e.target.files[0]) || null)} />
        <div className="flex gap-3">
          <Button type="submit">Submit Application</Button>
          <Button type="button" variant="secondary" onClick={() => { setName(''); setEmail(''); setPhone(''); setAddress(''); setOffice(''); setResume(null); setSubmitted(false); }}>Reset</Button>
        </div>
      </form>

      {submitted && (
        <div className="mt-8 max-w-2xl rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="font-semibold text-green-800">Application submitted successfully!</div>
          <div className="mt-1 text-sm text-green-700">Selected office: <span className="font-medium">{office || nearest}</span></div>
        </div>
      )}
    </div>
  );
}

