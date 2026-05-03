import { ContactCard } from "@/components/ui/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa6";

export default function DefaultDemo() {
	return (
		<main className="relative flex flex-col size-full w-full items-center justify-center p-4">
			<div className="mx-auto max-w-5xl">
				<ContactCard
					title="Get in touch"
					description="If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day."
					contactInfo={[
						{
							icon: MailIcon,
							label: 'Email',
							value: 'technura7@gmail.com',
						},
						{
							icon: PhoneIcon,
							label: 'Phone',
							value: '+250 799 373 450',
						},
						{
							icon: MapPinIcon,
							label: 'Address',
							value: 'Kigali, CHIC',
						}
					]}
				>
					<form action="" className="w-full space-y-4">
						<div className="flex flex-col gap-2">
							<Label>Name</Label>
							<Input type="text" />
						</div>
						<div className="flex flex-col gap-2">
							<Label>Email</Label>
							<Input type="email" />
						</div>
						<div className="flex flex-col gap-2">
							<Label>Phone</Label>
							<Input type="phone" />
						</div>
						<div className="flex flex-col gap-2">
							<Label>Message</Label>
							<Textarea  />
						</div>
                        <div className="flex flex-col gap-2">
                            <a href="mailto:niyubwayoiraelie5777@gmail.com">
                            <MagicButton 
                            title="Let's get in touch" 
                            icon={<FaLocationArrow />}
                            position="right"
                            />
                            </a>
                        </div>
						
					</form>
				</ContactCard>
			</div>
		</main>
	);
}
