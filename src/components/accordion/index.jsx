import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import styles from "./index.module.css";

const accordionItems = [
	{
		value: "item-1",
		question: "How long does a web design project take?",
		answer:
			"Lorem ipsum dolor sit amet, consectetur cdolor col adipiscing elit. Integer mattis nunc augue vel lacinia erat euismod ut. Sed eleifend tellus nonole tincidunt aliquet. Fusce aliquam mi felis.",
	},
	{
		value: "item-2",
		question: "What factors affect the cost of web design?",
		answer:
			"Lorem ipsum dolor sit amet, consectetur cdolor col adipiscing elit. Integer mattis nunc augue vel lacinia erat euismod ut. Sed eleifend tellus nonole tincidunt aliquet. Fusce aliquam mi felis.",
	},
	{
		value: "item-3",
		question: "Do you provide ongoing support?",
		answer:
			"Lorem ipsum dolor sit amet, consectetur cdolor col adipiscing elit. Integer mattis nunc augue vel lacinia erat euismod ut. Sed eleifend tellus nonole tincidunt aliquet. Fusce aliquam mi felis.",
	},
	{
		value: "item-4",
		question: "What is your web design process?",
		answer:
			"Lorem ipsum dolor sit amet, consectetur cdolor col adipiscing elit. Integer mattis nunc augue vel lacinia erat euismod ut. Sed eleifend tellus nonole tincidunt aliquet. Fusce aliquam mi felis.",
	},
];

const RadixAccordion = () => (
	<Accordion.Root
		className={`${styles.Root} flex flex-col gap-[30px] justify-center items-center px-[30px]`}
		type="single"
		defaultValue="item-1"
		collapsible
	>
		{accordionItems.map((item) => (
			<Accordion.Item className={`${styles.Item} px-[5px] py-[4px] lg:w-[584px] border-[1px] border-white/20 rounded-md backdrop-blur-[50px] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5`} value={item.value} key={item.value}>
				<AccordionTrigger>{item.question}</AccordionTrigger>
				<AccordionContent className="text-[14px] font-[300] leading-[1.3] tracking-wide">{item.answer}</AccordionContent>
			</Accordion.Item>
		))}
	</Accordion.Root>
);

const AccordionTrigger = React.forwardRef(
	({ children, className, ...props }, forwardedRef) => (
		<Accordion.Header className={styles.Header}>
			<Accordion.Trigger
				className={`${styles.Trigger}${className ? ` ${className}` : ""}`}
				{...props}
				ref={forwardedRef}
			>
				{children}
				<ChevronDownIcon className={styles.Chevron} aria-hidden />
			</Accordion.Trigger>
		</Accordion.Header>
	),
);

const AccordionContent = React.forwardRef(
	({ children, className, ...props }, forwardedRef) => (
		<Accordion.Content
			className={`${styles.Content}${className ? ` ${className}` : ""}`}
			{...props}
			ref={forwardedRef}
		>
			<div className={styles.ContentText}>{children}</div>
		</Accordion.Content>
	),
);

export default RadixAccordion;
