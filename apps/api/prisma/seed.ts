import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { UserRole, LeadStatus } from '../src/generated/prisma/enums';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

interface LeadRecord {
  id: string;
  customerName: string;
  message: string;
  platform: string;
  status: string;
  assignedToId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Clean existing data ───
  await prisma.activity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Cleaned existing data');

  // ─── Create Users ───
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner = await prisma.user.create({
    data: {
      name: 'Thang Nguyen',
      email: 'thang@leadflow.io',
      password: hashedPassword,
      role: UserRole.OWNER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Minh Tran',
      email: 'minh@leadflow.io',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      name: 'Linh Pham',
      email: 'linh@leadflow.io',
      password: hashedPassword,
      role: UserRole.STAFF,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: 'Huy Le',
      email: 'huy@leadflow.io',
      password: hashedPassword,
      role: UserRole.STAFF,
    },
  });

  const staff3 = await prisma.user.create({
    data: {
      name: 'Lan Vo',
      email: 'lan@leadflow.io',
      password: hashedPassword,
      role: UserRole.STAFF,
    },
  });

  const users = [owner, admin, staff1, staff2, staff3];
  console.log(`✅ Created ${users.length} users`);

  // ─── Create Leads ───
  const leadData = [
    // NEW leads (index 0-3)
    {
      customerName: 'David Wilson',
      message:
        'Hi, I saw your ad on Facebook. Can you tell me more about the Premium plan pricing?',
      platform: 'Facebook',
      status: LeadStatus.NEW,
      assignedToId: null,
    },
    {
      customerName: 'Sarah Chen',
      message:
        'Looking for a CRM solution for my team of 15 people. What do you offer?',
      platform: 'Website',
      status: LeadStatus.NEW,
      assignedToId: null,
    },
    {
      customerName: 'James Park',
      message:
        'Interested in the enterprise plan. Need integration with Slack and Jira.',
      platform: 'LinkedIn',
      status: LeadStatus.NEW,
      assignedToId: staff1.id,
    },
    {
      customerName: 'Emily Rodriguez',
      message: 'Do you have a free trial? I want to test before committing.',
      platform: 'Website',
      status: LeadStatus.NEW,
      assignedToId: null,
    },

    // REPLIED leads (index 4-6)
    {
      customerName: 'Michael Brown',
      message:
        'Thanks for the demo yesterday. I have a few follow-up questions about API access.',
      platform: 'Email',
      status: LeadStatus.REPLIED,
      assignedToId: admin.id,
    },
    {
      customerName: 'Anna Kowalski',
      message:
        'The proposal looks good. Can we negotiate on the annual pricing?',
      platform: 'Email',
      status: LeadStatus.REPLIED,
      assignedToId: staff2.id,
    },
    {
      customerName: 'Tom Nguyen',
      message:
        'We discussed the onboarding process. When can we start?',
      platform: 'Zalo',
      status: LeadStatus.REPLIED,
      assignedToId: staff1.id,
    },

    // WAITING leads (index 7-9)
    {
      customerName: 'Lisa Wang',
      message:
        'Sent the contract over. Waiting for legal team review on their end.',
      platform: 'Email',
      status: LeadStatus.WAITING,
      assignedToId: staff3.id,
    },
    {
      customerName: 'Robert Kim',
      message:
        'He said he needs to check with his manager. Follow up next Monday.',
      platform: 'Phone',
      status: LeadStatus.WAITING,
      assignedToId: admin.id,
    },
    {
      customerName: 'Jennifer Lee',
      message:
        'Interested but comparing with 2 other solutions. Will decide by end of month.',
      platform: 'LinkedIn',
      status: LeadStatus.WAITING,
      assignedToId: staff2.id,
    },

    // CONVERTED leads (index 10-13)
    {
      customerName: 'Alex Thompson',
      message:
        'Signed the contract! Starting with 10 seats on the Pro plan.',
      platform: 'Website',
      status: LeadStatus.CONVERTED,
      assignedToId: owner.id,
    },
    {
      customerName: 'Maria Garcia',
      message: 'Payment received. Onboarding scheduled for next week.',
      platform: 'Facebook',
      status: LeadStatus.CONVERTED,
      assignedToId: staff1.id,
    },
    {
      customerName: 'Kevin Tran',
      message:
        'Upgraded from free trial to Business plan. Very happy with the product.',
      platform: 'Website',
      status: LeadStatus.CONVERTED,
      assignedToId: staff3.id,
    },
    {
      customerName: 'Sophie Martin',
      message:
        'Signed annual contract for 25 seats. Enterprise deal closed!',
      platform: 'Email',
      status: LeadStatus.CONVERTED,
      assignedToId: admin.id,
    },

    // IGNORED leads (index 14-15)
    {
      customerName: 'Unknown Visitor',
      message: 'asdfgh test 123',
      platform: 'Website',
      status: LeadStatus.IGNORED,
      assignedToId: null,
    },
    {
      customerName: 'John Spam',
      message: 'Buy cheap followers now! Best price guaranteed!',
      platform: 'Facebook',
      status: LeadStatus.IGNORED,
      assignedToId: null,
    },
  ];

  const leads: LeadRecord[] = [];
  for (const data of leadData) {
    const lead = await prisma.lead.create({ data });
    leads.push(lead as unknown as LeadRecord);
  }
  console.log(`✅ Created ${leads.length} leads`);

  // ─── Create Activities ───
  const activities = [
    // Activities for replied leads
    { leadId: leads[4]!.id, userId: admin.id, action: 'Sent demo invitation email' },
    { leadId: leads[4]!.id, userId: admin.id, action: 'Completed product demo' },
    { leadId: leads[4]!.id, userId: admin.id, action: 'Updated status to Replied' },

    { leadId: leads[5]!.id, userId: staff2.id, action: 'Sent pricing proposal' },
    { leadId: leads[5]!.id, userId: staff2.id, action: 'Updated status to Replied' },

    { leadId: leads[6]!.id, userId: staff1.id, action: 'Called customer to discuss requirements' },
    { leadId: leads[6]!.id, userId: staff1.id, action: 'Updated status to Replied' },

    // Activities for waiting leads
    { leadId: leads[7]!.id, userId: staff3.id, action: 'Sent contract for review' },
    { leadId: leads[7]!.id, userId: staff3.id, action: 'Updated status to Waiting' },

    { leadId: leads[8]!.id, userId: admin.id, action: 'Left voicemail follow-up' },
    { leadId: leads[8]!.id, userId: admin.id, action: 'Updated status to Waiting' },

    // Activities for converted leads
    { leadId: leads[10]!.id, userId: owner.id, action: 'Initial contact via website form' },
    { leadId: leads[10]!.id, userId: owner.id, action: 'Sent proposal' },
    { leadId: leads[10]!.id, userId: owner.id, action: 'Contract signed' },
    { leadId: leads[10]!.id, userId: owner.id, action: 'Updated status to Converted' },

    { leadId: leads[11]!.id, userId: staff1.id, action: 'Responded to Facebook inquiry' },
    { leadId: leads[11]!.id, userId: staff1.id, action: 'Scheduled product demo' },
    { leadId: leads[11]!.id, userId: staff1.id, action: 'Updated status to Converted' },

    { leadId: leads[13]!.id, userId: admin.id, action: 'Enterprise requirements meeting' },
    { leadId: leads[13]!.id, userId: admin.id, action: 'Custom proposal sent' },
    { leadId: leads[13]!.id, userId: admin.id, action: 'Negotiation completed' },
    { leadId: leads[13]!.id, userId: admin.id, action: 'Updated status to Converted' },

    // Activities for new leads (assigned one)
    { leadId: leads[2]!.id, userId: staff1.id, action: 'Lead assigned for follow-up' },

    // Activities for ignored leads
    { leadId: leads[14]!.id, userId: null, action: 'Marked as spam' },
    { leadId: leads[14]!.id, userId: null, action: 'Updated status to Ignored' },
    { leadId: leads[15]!.id, userId: null, action: 'Updated status to Ignored' },
  ];

  for (const data of activities) {
    await prisma.activity.create({ data });
  }
  console.log(`✅ Created ${activities.length} activities`);

  // ─── Summary ───
  console.log('\n📊 Seed Summary:');
  console.log(`   Users:      ${users.length} (1 owner, 1 admin, 3 staff)`);
  console.log(`   Leads:      ${leads.length} (4 new, 3 replied, 3 waiting, 4 converted, 2 ignored)`);
  console.log(`   Activities: ${activities.length}`);
  console.log('\n🔑 Login credentials (all accounts):');
  console.log('   Password: password123');
  console.log('   Owner:    thang@leadflow.io');
  console.log('   Admin:    minh@leadflow.io');
  console.log('   Staff:    linh@leadflow.io / huy@leadflow.io / lan@leadflow.io');
  console.log('\n✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
