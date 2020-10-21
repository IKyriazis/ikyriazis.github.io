---
title: "Writeup for crond challenge at WPICTF 2019"
layout: post
date: 2019-04-15 07:00
projects: true
hidden: true
description: "After solving this challenge I decided to do a writeup"
category: project
author: ioannis
externalLink: false
---

# crond

### author: ikyriazis

    Why not roll your own version of cron?
    ssh ctf@crond.wpictf.xyz
    pass: they will never guess it
    Brought to you by acurless and SuckMore Software, a division of WPI Digital Holdings Ltd.

We are told to ssh into a machine and we are given a password. The first thing we see when we enter is a shell. Hmmm. Where can we go from here? Let’s look at the hint. `Why not roll your own version of cron?` Ok. Cron is a process, let’s check if it’s running. To do this, we run `top`. Hmmm we get `sh: top: command not found`. Bummer. SuckMore really does suck. Let’s try `ps`. Hmmm still doesn’t work.

![image1](/assets/images/cronwriteup/image1.png)

Wait a second! In linux, everything is a file. That must mean processes are files too! Where are processes stored? In the `/proc` directory, which is a fitting name. Let’s `cd` into that directory. If we `ls` we see a bunch of files and directories. If we `ls` again we see that 2 of those directories have changed. The numbers we see are PIDs. Process ids allow us to distinguish one process from another.

![image2](/assets/images/cronwriteup/image2.png)

Let’s go into process 1’s folder. If we `ls` again we see a bunch of different files and directories. A particularly interesting file is `cmdline` because it can tell us the cmdline arguments. Let’s `cat` that and see what’s init (not a typo). It prints out `/bin/bash/bin/init_d`.

![image3](/assets/images/cronwriteup/image3.png)

Process 1 is init. Linux uses this process to spawn all other processes. If you are on a linux machine, and are viewing this on a web browser, init is one of your web browser’s ancestors. This isn’t the cron process. Let’s stop wasting time and find it. We list the contents of 10, `cat` cmdline, and see that it prints `suctf`. Not cron. 12 isn’t cron either. The next two are constantly changing so it would be no use trying to enter them. Let’s see what’s in 9\. We get `/bin/bash/usr/bin/fakecron` when we print `cmdline`.

![image4](/assets/images/cronwriteup/image4.png)

AHA! This is the cron process! The cmdline arguments tell us that fakecron is stored at `/usr/bin`. Let’s go there! If we `cat` fakecron we are able to see the source code that acurless is very _not_ proud of.

    #!/bin/bash
    # Cron. But worse.
    #
    # Copyright (c) 2019, SuckMore Software, a division of WPI Digital Holdings Ltd.
    # Redistribution and use in source and binary forms, with or without
    # modification, are permitted provided that the following conditions are met:
    # 1\. Redistributions of source code must retain the above copyrig
    #    notice, this list of conditions and the following disclaimer.
    # 2\. Redistributions in binary form must reproduce the above copyright
    #    notice, this list of conditions and the following disclaimer in the
    #    documentation and/or other materials provided with the distribution.
    # 3\. All advertising materials mentioning features or use of this software
    #    must display the following acknowledgement:
    #    This product includes software developed by SuckMore Software, a division
    #    of WPI Digital Holdings Ltd.
    # 4\. Neither the name of the SuckMore Software, a division of WPI Digital Holdings
    #    Ltd, nor the names of its contributors may be used to endorse or promote
    #    products derived from this software without specific prior written permission.
    #
    # THIS SOFTWARE IS PROVIDED BY SuckMore Software, a division of
    # WPI Digital Holdings Ltd., ''AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
    # INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
    # FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
    # SuckMore Software, a division of WPI Digital Holdings Ltd.
    # DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    # (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    # LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    # ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    # (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    # SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    file="/etc/deadline"

    cron() {
        second=0
        minute=0
        hour=0
        day=1;
        month=1;
        year=2019;

        while true; do
            sleep 1;
            target_second=`cut -d " " -f 6 $file`
            target_minute=`cut -d " " -f 5 $file`
            target_hour=`cut -d " " -f 4 $file`
            target_day=`cut -d " " -f 3 $file`
            target_month=`cut -d " " -f 2 $file`
            target_year=`cut -d " " -f 1 $file`

            if [[ "$second" -eq 59 ]]; then
                minute=$((minute+1));
                second=0;
            elif [[ "$minute" -eq 59 ]]; then
                hour=$((hour+1));
                second=0;
                minute=0;
            else
                second=$((second+1));
            fi

            if [[ "$year" -eq "$target_year" ]] \
                && [[ "$month" -eq "$target_month" ]] \
                && [[ "$day" -eq "$target_day" ]] \
                && [[ "$hour" -eq "$target_second" ]] \
                && [[ "$minute" -eq "$target_minute" ]] \
                && [[ "$second" -eq "$target_hour" ]]; then
                # echo "WPI{}" > /home/ctf/flag.txt
                exec_flag
            fi

            rm /etc/faketimerc
            echo "$year-$month-$day $hour:$minute:$second" > /etc/faketimerc
        done
    }

    cron &

To summarize, the code takes in a date from `/etc/deadline` and checks to see if it is currently that date. If it is, it runs exec_flag which I assume prints out the flag to `/home/ctf/flag.txt`. We can make that happen multiple ways. 1) We can change `/etc/deadline` to be a few seconds from the current time and 2) We can `echo "2020-1-1 0:1:0"` into `/etc/faketimerc`. The second way fails because we don’t have permission to write to `/etc/faketimerc`. Let’s use `vi` to change the deadline. Hmm that didn’t work either! Let’s check `/etc/faketimerc` to make sure that our deadline is correct. Oh!! The system thinks that it is `2019-1-1 0:4:28`. Let’s change the deadline to a few seconds from this time. `2019-1-1 0:6:0`. Let’s wait now until `/etc/faketimerc` is `2019-1-1 0:6:0`. Ok we’re good. Let’s check `/home/ctf/flag.txt`. Voila!

![image5](/assets/images/cronwriteup/image5.png)
