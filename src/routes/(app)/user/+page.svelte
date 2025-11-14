<script lang="ts">
	const stats = [
		{ label: 'Courses Enrolled', value: '8', icon: '📚' },
		{ label: 'Certificates Earned', value: '5', icon: '📜' },
		{ label: 'Projects Completed', value: '12', icon: '✅' },
		{ label: 'Hours Learned', value: '127', icon: '⏱️' }
	];

	const currentCourses = [
		{ title: 'Music Production Basics', progress: 75, instructor: 'Aliu Ifeoluwa', dueDate: '2 weeks' },
		{ title: 'Video Editing Masterclass', progress: 45, instructor: 'Aliu Ifeoluwa', dueDate: '1 month' },
		{ title: 'Sound Engineering', progress: 90, instructor: 'Aliu Ifeoluwa', dueDate: '3 days' }
	];

	const recentActivity = [
		{ action: 'Completed lesson: Audio Mixing', time: '2 hours ago', type: 'course' },
		{ action: 'Earned certificate: Music Production', time: '1 day ago', type: 'certificate' },
		{ action: 'Submitted project: My First Track', time: '2 days ago', type: 'project' },
		{ action: 'Started new course: Sound Engineering', time: '1 week ago', type: 'course' }
	];
</script>

<svelte:head>
	<title>Dashboard - User Portal</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-dark-100 mb-2">Welcome Back!</h1>
		<p class="text-dark-400">Continue your learning journey and achieve your goals.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat}
			<div class="bg-dark-900 border border-dark-800 rounded-xl p-6 hover:border-accent-600/50 transition-colors">
				<div class="text-3xl mb-4">{stat.icon}</div>
				<div class="text-3xl font-bold text-dark-100 mb-1">{stat.value}</div>
				<div class="text-sm text-dark-400">{stat.label}</div>
			</div>
		{/each}
	</div>

	<!-- Current Courses -->
	<div class="bg-dark-900 border border-dark-800 rounded-xl p-6">
		<h2 class="text-xl font-bold text-dark-100 mb-6">Current Courses</h2>
		<div class="space-y-6">
			{#each currentCourses as course}
				<div class="space-y-3">
					<div class="flex items-start justify-between">
						<div>
							<h3 class="text-dark-100 font-semibold">{course.title}</h3>
							<p class="text-sm text-dark-500">Instructor: {course.instructor}</p>
						</div>
						<span class="text-sm text-accent-400 font-medium">{course.progress}%</span>
					</div>
					<div class="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
						<div class="bg-gradient-to-r from-accent-600 to-primary-600 h-full rounded-full transition-all" style="width: {course.progress}%"></div>
					</div>
					<p class="text-xs text-dark-500">Due in {course.dueDate}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="bg-dark-900 border border-dark-800 rounded-xl p-6">
		<h2 class="text-xl font-bold text-dark-100 mb-6">Recent Activity</h2>
		<div class="space-y-4">
			{#each recentActivity as activity}
				<div class="flex items-start space-x-4 pb-4 border-b border-dark-800 last:border-0 last:pb-0">
					<div class="w-10 h-10 bg-accent-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="10" stroke-width="2"/>
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-dark-200 font-medium">{activity.action}</p>
						<p class="text-sm text-dark-500 mt-1">{activity.time}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
